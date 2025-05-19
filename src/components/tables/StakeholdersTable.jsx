"use client";

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Avatar,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

// Стилизованные компоненты
const Sticker = styled(Box)(({ type }) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    margin: '4px',
    backgroundColor: type === 'important' ? '#e8f5e9' : '#fce4ec',
    border: `2px solid ${type === 'important' ? '#4caf50' : '#f48fb1'}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
    maxWidth: '300px',
    wordBreak: 'break-word',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)'
    }
}));

const DeleteStickerButton = styled(IconButton)({
    position: 'absolute',
    right: '-12px',
    top: '-12px',
    backgroundColor: '#ff5252',
    color: 'white',
    width: '24px',
    height: '24px',
    '&:hover': {
        backgroundColor: '#ff1744'
    }
});

const StakeholdersTable = ({ stakeholders, onUpdateStakeholders }) => {
    const [openModal, setOpenModal] = useState(false);
    const [currentStakeholder, setCurrentStakeholder] = useState(null);
    const [newConcern, setNewConcern] = useState('');
    const [selectedConcernType, setSelectedConcernType] = useState('important');
    const [activeSticker, setActiveSticker] = useState(null);

    const handleOpenModal = (stakeholder) => {
        setCurrentStakeholder(stakeholder);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewConcern('');
        setSelectedConcernType('important');
    };

    const handleAddConcern = () => {
        if (!newConcern.trim() || !currentStakeholder) return;

        const updatedStakeholders = stakeholders.map(stakeholder => {
            if (stakeholder.id === currentStakeholder.id) {
                return {
                    ...stakeholder,
                    concerns: [
                        ...(stakeholder.concerns || []),
                        {
                            id: Date.now().toString(),
                            text: newConcern.trim(),
                            type: selectedConcernType
                        }
                    ]
                };
            }
            return stakeholder;
        });

        onUpdateStakeholders(updatedStakeholders);
        handleCloseModal();
    };

    const handleDeleteConcern = (stakeholderId, concernId) => {
        const updatedStakeholders = stakeholders.map(stakeholder => {
            if (stakeholder.id === stakeholderId) {
                return {
                    ...stakeholder,
                    concerns: (stakeholder.concerns || []).filter(c => c.id !== concernId)
                };
            }
            return stakeholder;
        });

        onUpdateStakeholders(updatedStakeholders);
    };

    if (stakeholders.length === 0) {
        return ''
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 4, borderRadius: '12px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                backgroundColor: '#ffebee',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                width: '30%'
                            }}>
                                Стейкхолдеры
                            </TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>
                                Стикеры концернов
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stakeholders.map((stakeholder) => (
                            <TableRow key={stakeholder.id} hover>
                                <TableCell sx={{
                                    backgroundColor: '#ffebee',
                                    verticalAlign: 'top'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            bgcolor: 'red',
                                            mr: 2,
                                            width: 40,
                                            height: 40,
                                            fontSize: '1.2rem'
                                        }}>
                                            {stakeholder.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {stakeholder.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ verticalAlign: 'top' }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                        mb: 2,
                                        minHeight: '60px'
                                    }}>
                                        {(stakeholder.concerns || []).map((concern) => (
                                            <Sticker
                                                key={concern.id}
                                                type={concern.type}
                                                onMouseEnter={() => setActiveSticker(concern.id)}
                                                onMouseLeave={() => setActiveSticker(null)}
                                            >
                                                {concern.text}
                                                {activeSticker === concern.id && (
                                                    <DeleteStickerButton
                                                        size="small"
                                                        onClick={() => handleDeleteConcern(stakeholder.id, concern.id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </DeleteStickerButton>
                                                )}
                                            </Sticker>
                                        ))}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenModal(stakeholder)}
                                        sx={{ height: '40px' }}
                                    >
                                        Добавить концерн
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модальное окно для добавления концерна */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить новый концерн</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={newConcern}
                            onChange={(e) => setNewConcern(e.target.value)}
                            label="Текст концерна"
                            variant="outlined"
                            sx={{ mb: 3 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Тип концерна</InputLabel>
                            <Select
                                value={selectedConcernType}
                                onChange={(e) => setSelectedConcernType(e.target.value)}
                                label="Тип концерна"
                            >
                                <MenuItem value="important">Важный</MenuItem>
                                <MenuItem value="ignored">Игнорируемый</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddConcern}
                        color="primary"
                        variant="contained"
                        disabled={!newConcern.trim()}
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StakeholdersTable;