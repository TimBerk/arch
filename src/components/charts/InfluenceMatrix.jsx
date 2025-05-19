"use client";

import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import StakeholdersTable from '../tables/StakeholdersTable';


const InfluenceMatrix = () => {
    const [stakeholders, setStakeholders] = useState([]);
    const [newStakeholder, setNewStakeholder] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const svgRef = useRef(null);
    const [selectedCoords, setSelectedCoords] = useState({ x: 1, y: 1 });
    const [dragging, setDragging] = useState(null);

    const handleSvgClick = (event) => {
        if (!svgRef.current || dragging) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(2, ((event.clientX - svgRect.left) / svgRect.width) * 2));
        const y = Math.max(0, Math.min(2, 2 - ((event.clientY - svgRect.top) / svgRect.height) * 2));

        setSelectedCoords({ x, y });
    };

    const handleMouseMove = (event) => {
        if (!dragging || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(2, ((event.clientX - svgRect.left) / svgRect.width) * 2));
        const y = Math.max(0, Math.min(2, 2 - ((event.clientY - svgRect.top) / svgRect.height) * 2));

        setStakeholders(stakeholders.map(st =>
            st.id === dragging ? { ...st, x, y } : st
        ));
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const handleAddStakeholder = () => {
        if (!newStakeholder.trim()) return;

        const newStakeholderItem = {
            id: Date.now().toString(),
            name: newStakeholder.trim(),
            x: selectedCoords.x,
            y: selectedCoords.y,
            concerns: []
        };

        setStakeholders([...stakeholders, newStakeholderItem]);
        setNewStakeholder('');
    };

    const handleDelete = (id) => {
        setStakeholders(stakeholders.filter(st => st.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const startEditing = (stakeholder) => {
        setEditingId(stakeholder.id);
        setEditName(stakeholder.name);
    };

    const saveEdit = () => {
        setStakeholders(stakeholders.map(st =>
            st.id === editingId ? { ...st, name: editName } : st
        ));
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const svgWidth = 800;
    const svgHeight = 700;
    const padding = 50;

    const scaleX = (x) => padding + (x / 2) * (svgWidth - 2 * padding);
    const scaleY = (y) => svgHeight - padding - (y / 2) * (svgHeight - 2 * padding);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Матрица влияния
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', alignContent: 'center' }}>
                <Box sx={{userSelect: 'none'}}>
                    <svg
                        ref={svgRef}
                        width={svgWidth}
                        height={svgHeight}
                        onClick={handleSvgClick}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        {/* Grid lines */}
                        {[0, 1, 2].map((val) => (
                            <React.Fragment key={`x${val}`}>
                                <line
                                    x1={scaleX(val)}
                                    y1={scaleY(0)}
                                    x2={scaleX(val)}
                                    y2={scaleY(2)}
                                    stroke="#ddd"
                                    strokeWidth={1}
                                />
                                <line
                                    x1={scaleX(0)}
                                    y1={scaleY(val)}
                                    x2={scaleX(2)}
                                    y2={scaleY(val)}
                                    stroke="#ddd"
                                    strokeWidth={1}
                                />
                            </React.Fragment>
                        ))}

                        {/* Areas */}
                        {/* Monitoring */}
                        <polygon
                            points={`
                                ${scaleX(0)},${scaleY(0)} 
                                ${scaleX(0)},${scaleY(1)} 
                                ${scaleX(1)},${scaleY(1)} 
                                ${scaleX(1)},${scaleY(0)}
                            `}
                            fill="rgb(255, 255, 255)"
                            stroke="grey"
                            strokeWidth={2}
                        />
                        <text
                            x={scaleX(0.5)}
                            y={scaleY(0.5)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={20}
                            fontWeight={700}
                        >
                            Мониторинг
                        </text>

                        {/* Informing */}
                        <polygon
                            points={`
                                ${scaleX(1)},${scaleY(0)} 
                                ${scaleX(1)},${scaleY(1)} 
                                ${scaleX(2)},${scaleY(1)} 
                                ${scaleX(2)},${scaleY(0)}
                            `}
                            fill="rgb(255,255, 255)"
                            stroke="grey"
                            strokeWidth={2}
                        />
                        <text
                            x={scaleX(1.5)}
                            y={scaleY(0.5)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={20}
                            fontWeight={700}
                        >
                            Информирование
                        </text>

                        {/* Needs satisfaction */}
                        <polygon
                            points={`
                                ${scaleX(0)},${scaleY(1)} 
                                ${scaleX(0)},${scaleY(2)} 
                                ${scaleX(1)},${scaleY(2)} 
                                ${scaleX(1)},${scaleY(1)}
                            `}
                            fill="rgb(255, 255, 255)"
                            stroke="grey"
                            strokeWidth={2}
                        />
                        <text
                            x={scaleX(0.5)}
                            y={scaleY(1.5)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={20}
                            fontWeight={700}
                        >
                            Удовлетворение потребностей
                        </text>

                        {/* Close work */}
                        <polygon
                            points={`
                                ${scaleX(1)},${scaleY(1)} 
                                ${scaleX(1)},${scaleY(2)} 
                                ${scaleX(2)},${scaleY(2)} 
                                ${scaleX(2)},${scaleY(1)}
                            `}
                            fill="rgba(255, 255, 255)"
                            stroke="grey"
                            strokeWidth={2}
                        />
                        <text
                            x={scaleX(1.5)}
                            y={scaleY(1.5)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={20}
                            fontWeight={700}
                        >
                            Тесная работа
                        </text>

                        {/* Axes */}
                        <line
                            x1={padding}
                            y1={svgHeight - padding}
                            x2={svgWidth - padding}
                            y2={svgHeight - padding}
                            stroke="#000"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                        />
                        <line
                            x1={padding}
                            y1={svgHeight - padding}
                            x2={padding}
                            y2={padding}
                            stroke="#000"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                        />

                        {/* Arrow markers */}
                        <defs>
                            <marker
                                id="arrow"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                                markerUnits="strokeWidth"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#000" />
                            </marker>
                        </defs>

                        {/* Axis labels */}
                        <text
                            x={svgWidth / 2}
                            y={svgHeight - 15}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight="bold"
                        >
                            Интерес
                        </text>
                        <text
                            x={20}
                            y={svgHeight / 2}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight="bold"
                            transform={`rotate(-90, 20, ${svgHeight / 2})`}
                        >
                            Влияние
                        </text>

                        {/* Axis ticks */}
                        {[0, 1, 2].map((val) => (
                            <React.Fragment key={`tick${val}`}>
                                <text
                                    x={scaleX(val)}
                                    y={svgHeight - padding + 20}
                                    textAnchor="middle"
                                    fontSize={12}
                                >
                                    {['Низкий/ое', 'Средний', 'Высокий'][val]}
                                </text>
                                <text
                                    x={padding - 20}
                                    y={scaleY(val)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={12}
                                    transform={`rotate(-90, ${padding - 15}, ${scaleY(val)})`}
                                >
                                    {['', 'Среднее', 'Высокое'][val]}
                                </text>
                            </React.Fragment>
                        ))}

                        {/* Stakeholders */}
                        {stakeholders.map((st) => (
                            <g key={st.id}>
                                <circle
                                    cx={scaleX(st.x)}
                                    cy={scaleY(st.y)}
                                    r={8}
                                    fill="red"
                                    onMouseDown={() => setDragging(st.id)}
                                    style={{ cursor: 'grab' }}
                                />
                                <text
                                    x={scaleX(st.x)}
                                    y={scaleY(st.y) - 15}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fontWeight="bold"
                                >
                                    {st.name}
                                </text>
                            </g>
                        ))}

                        {/* Selected point indicator */}
                        <circle
                            cx={scaleX(selectedCoords.x)}
                            cy={scaleY(selectedCoords.y)}
                            r={5}
                            fill="none"
                            stroke="black"
                            strokeWidth={2}
                            strokeDasharray="3,3"
                        />
                    </svg>
                </Box>

                <Box sx={{width: 300 }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {editingId ? 'Редактирование' : 'Добавить стейкхолдера'}
                        </Typography>

                        {editingId ? (
                            <>
                                <TextField
                                    label="Имя стейкхолдера"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={saveEdit}
                                        fullWidth
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={cancelEdit}
                                        fullWidth
                                    >
                                        Отмена
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <TextField
                                    label="Имя стейкхолдера"
                                    value={newStakeholder}
                                    onChange={(e) => setNewStakeholder(e.target.value)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />

                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Координаты: {selectedCoords.x.toFixed(1)}, {selectedCoords.y.toFixed(1)}
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleAddStakeholder}
                                    fullWidth
                                    disabled={!newStakeholder.trim()}
                                >
                                    Добавить
                                </Button>
                            </>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Стейкхолдеры ({stakeholders.length})
                            </Typography>

                            {stakeholders.length === 0 ? (
                                <Typography variant="body2">Нет добавленных стейкхолдеров</Typography>
                            ) : (
                                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {stakeholders.map((st) => (
                                        <Paper key={st.id} sx={{ p: 1, mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography>{st.name}</Typography>
                                                    <Typography variant="caption">
                                                        Координаты: {st.x.toFixed(1)}, {st.y.toFixed(1)}
                                                    </Typography>
                                                </Box>
                                                <IconButton onClick={() => startEditing(st)} size="small">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(st.id)} size="small">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

            </Box>

            <StakeholdersTable
                stakeholders={stakeholders}
                onUpdateStakeholders={setStakeholders}
            />
        </Box>
    );
};

export default InfluenceMatrix;