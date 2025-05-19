"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, IconButton,
    TextField, Tooltip, styled
} from '@mui/material';
import { Add, Delete, Edit, Save, Image as ImageIcon } from '@mui/icons-material';
import { HexColorPicker } from 'react-colorful';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

const ChartContainer = styled(Box)({
    position: 'relative',
    width: '800px',
    height: '600px',
    border: '1px solid #ccc',
    margin: '20px auto',
    background: 'white',
    overflow: 'visible',
});

const AxisLabel = styled(Typography)({
    position: 'absolute',
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: '0 5px',
});

const DomainZone = styled('polygon')(({ zonecolor }) => ({
    fill: zonecolor,
    stroke: '#666',
    strokeWidth: 1,
    '&:hover': {
        fillOpacity: 0.5,
    },
}));

const DomainSticker = styled(Paper)(({ theme, color }) => ({
    position: 'absolute',
    padding: theme.spacing(1),
    backgroundColor: color,
    cursor: 'move',
    width: '120px',
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[2],
    '&:hover': {
        boxShadow: theme.shadows[6],
        zIndex: 100,
    },
}));

const DomainChart = () => {
    const [stickers, setStickers] = useState([]);
    const [editingSticker, setEditingSticker] = useState(null);
    const [newStickerText, setNewStickerText] = useState('');
    const [selectedColor, setSelectedColor] = useState('#ffcc00');
    const [isAddingSticker, setIsAddingSticker] = useState(false);
    const chartRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false)

    // Convert chart coordinates to pixel positions
    const toPixelPosition = (x, y) => {
        const chartWidth = 800;
        const chartHeight = 600;
        return {
            x: (x / 4) * chartWidth,
            y: chartHeight - (y / 3) * chartHeight
        };
    };

    // Determine which domain a point belongs to
    const getDomainType = (x, y) => {
        // Core domain
        if (x >= 2 && x <= 4 && y >= 1 && y <= 3) return 'core';

        // Supporting domain (complex shape)
        if (
            (x >= 1 && x <= 2 && y >= 0 && y <= 3) || // Left rectangle
            (x >= 2 && x <= 4 && y >= 0 && y <= 1)    // Bottom rectangle
        ) return 'supporting';

        // Generic domain
        if (x >= 0 && x <= 1 && y >= 0 && y <= 3) return 'generic';

        return null;
    };

    // Add a new sticker
    const handleAddSticker = (e) => {
        if (!chartRef.current) return;

        const rect = chartRef.current.getBoundingClientRect();
        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        // Convert to chart coordinates
        const x = (pixelX / 800) * 4;
        const y = 3 - (pixelY / 600) * 3;

        const domainType = getDomainType(x, y);
        if (!domainType) return;

        const newSticker = {
            id: uuidv4(),
            text: newStickerText || 'New Domain',
            x,
            y,
            color: selectedColor,
            domainType,
        };

        setStickers([...stickers, newSticker]);
        setIsAddingSticker(false);
        setNewStickerText('');
    };

    // Move a sticker
    const handleStickerDrag = (id, e) => {
        if (!chartRef.current) return;

        const rect = chartRef.current.getBoundingClientRect();
        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        // Convert to chart coordinates
        const x = (pixelX / 800) * 4;
        const y = 3 - (pixelY / 600) * 3;

        const domainType = getDomainType(x, y);
        if (!domainType) return;

        setStickers(stickers.map(sticker =>
            sticker.id === id ? { ...sticker, x, y, domainType } : sticker
        ));
    };

    // Delete a sticker
    const handleDeleteSticker = (id) => {
        setStickers(stickers.filter(sticker => sticker.id !== id));
    };

    // Save stickers to localStorage
    const saveStickers = () => {
        localStorage.setItem('domainStickers', JSON.stringify(stickers));
    };

    // Export chart as image
    const exportAsImage = async () => {
        const element = chartRef.current;
        const canvas = await html2canvas(element);

        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = 'image.jpg';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    }

    // Load stickers from localStorage
    useEffect(() => {
        const savedStickers = localStorage.getItem('domainStickers');
        if (savedStickers) setStickers(JSON.parse(savedStickers));
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Domain Strategy Chart
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setIsAddingSticker(true)}
                >
                    Add Domain
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={saveStickers}
                >
                    Save Layout
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ImageIcon />}
                    onClick={exportAsImage}
                >
                    Export as Image
                </Button>
            </Box>

            {/* Add Sticker Dialog */}
            {isAddingSticker && (
                <Paper sx={{ p: 3, mb: 4, maxWidth: '500px' }}>
                    <Typography variant="h6" gutterBottom>Add New Domain</Typography>
                    <TextField
                        fullWidth
                        label="Domain Name"
                        value={newStickerText}
                        onChange={(e) => setNewStickerText(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Typography gutterBottom>Color</Typography>
                    <HexColorPicker
                        color={selectedColor}
                        onChange={setSelectedColor}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Click on the chart to place the domain in the appropriate zone
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsAddingSticker(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Chart Area */}
            <Box ref={chartRef} sx={{width: '850px', height: '650px', margin: '0 auto', padding: '2px 10px 25px'}}>
                <ChartContainer onClick={isAddingSticker ? handleAddSticker : undefined}>
                    {/* Y Axis Label (placed outside chart) */}
                    <AxisLabel sx={{
                        top: '70%',
                        left: '-15px',
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'left center'
                    }}>
                        Model Complexity (Low → High)
                    </AxisLabel>
                    {/* X Axis (Business Differentiation) */}
                    <AxisLabel sx={{ bottom: '-30px', left: '50%', transform: 'translateX(-50%)' }}>
                        Business Differentiation (Low → High)
                    </AxisLabel>
                    {[0, 1, 2, 3, 4].map((tick) => (
                        <React.Fragment key={`x-${tick}`}>
                            <line
                                x1={(tick / 4) * 800}
                                y1={600}
                                x2={(tick / 4) * 800}
                                y2={590}
                                stroke="#666"
                            />
                        </React.Fragment>
                    ))}

                    {/* Y Axis (Model Complexity) */}
                    {[0, 1, 2, 3].map((tick) => (
                        <React.Fragment key={`y-${tick}`}>
                            <line
                                x1={0}
                                y1={600 - (tick / 3) * 600}
                                x2={10}
                                y2={600 - (tick / 3) * 600}
                                stroke="#666"
                            />
                        </React.Fragment>
                    ))}

                    {/* Domain Zones */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        {/* Generic Domain */}
                        <DomainZone
                            points="0,600 0,0 200,0 200,600"
                            zonecolor="#A2A2A2"
                        />
                        <text x="100" y="300" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">
                            GENERIC
                        </text>

                        {/* Supporting Domain - Complete shape */}
                        <DomainZone
                            points="200,600 200,0 400,0 400,400 800,400 800,600"
                            zonecolor="#9F7DCD"
                        />
                        <text x="500" y="500" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">
                            SUPPORTING
                        </text>

                        {/* Core Domain */}
                        <DomainZone
                            points="400,0 400,400 800,400 800,0"
                            zonecolor="#76A993"
                        />
                        <text x="600" y="200" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">
                            CORE
                        </text>
                    </svg>

                    {/* Stickers */}
                    {stickers.map((sticker) => {
                        const pos = toPixelPosition(sticker.x, sticker.y);
                        return (
                            <DomainSticker
                                key={sticker.id}
                                color={sticker.color}
                                style={{
                                    left: `${pos.x - 60}px`,
                                    top: `${pos.y - 35}px`,
                                }}
                                draggable
                                onDragEnd={(e) => handleStickerDrag(sticker.id, e)}
                            >
                                <Typography variant="body2" align="center" fontWeight="bold">
                                    {sticker.text}
                                </Typography>
                                <Typography variant="caption" display="block" align="center">
                                    ({sticker.domainType})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingSticker(sticker);
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSticker(sticker.id);
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </DomainSticker>
                        );
                    })}
                </ChartContainer>
            </Box>

            {/* Edit Dialog */}
            {editingSticker && (
                <Paper sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 3,
                    zIndex: 1000,
                    width: '400px',
                }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Domain: {editingSticker.text}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Domain Name"
                        value={editingSticker.text}
                        onChange={(e) => setEditingSticker({
                            ...editingSticker,
                            text: e.target.value
                        })}
                        sx={{ mb: 3 }}
                    />

                    <Typography gutterBottom>Color</Typography>
                    <HexColorPicker
                        color={editingSticker.color}
                        onChange={(color) => setEditingSticker({
                            ...editingSticker,
                            color
                        })}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                    <Typography gutterBottom>Current Position</Typography>
                    <Typography variant="body2">
                        Business Differentiation: {editingSticker.x.toFixed(2)}<br />
                        Model Complexity: {editingSticker.y.toFixed(2)}<br />
                        Domain Type: {editingSticker.domainType}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setEditingSticker(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setStickers(stickers.map(s =>
                                    s.id === editingSticker.id ? editingSticker : s
                                ));
                                setEditingSticker(null);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default DomainChart;