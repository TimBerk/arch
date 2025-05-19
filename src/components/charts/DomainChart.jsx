"use client";

import React, {useState, useRef, useEffect} from 'react';
import { Box, Typography, TextField, Button, Paper, IconButton, Grid } from '@mui/material';
import {Edit, Delete, Save, Image as ImageIcon} from '@mui/icons-material';
import {HexColorPicker} from "react-colorful";
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';


const DomainChart = () => {
    const [stickers, setStickers] = useState([]);
    const [newSticker, setNewSticker] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');
    const svgRef = useRef(null);
    const importRef = useRef(null);
    const [selectedCoords, setSelectedCoords] = useState({ x: 2, y: 1.5 });
    const [dragging, setDragging] = useState(null);

    const calculateCoords = (event) => {
        const svgRect = svgRef.current.getBoundingClientRect();
        const effectiveWidth = svgWidth - 2 * padding;
        const effectiveHeight = svgHeight - 2 * padding;

        // Вычисляем координаты относительно внутренней области (без padding)
        const x = ((event.clientX - svgRect.left - padding) / effectiveWidth) * 4;
        const y = 3 - ((event.clientY - svgRect.top - padding) / effectiveHeight) * 3;

        // Ограничиваем значения в пределах диаграммы
        return {
            x: Math.max(0, Math.min(4, x)),
            y: Math.max(0, Math.min(3, y))
        };
    }

    const handleSvgClick = (event) => {
        if (!svgRef.current || dragging) return;
        const {x, y} = calculateCoords(event);
        setSelectedCoords({ x, y });
    };

    const handleMouseMove = (event) => {
        if (!dragging || !svgRef.current) return;

        const { x, y } = calculateCoords(event);
        setStickers(stickers.map(st =>
            st.id === dragging ? { ...st, x, y } : st
        ));
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const handleAddSticker = () => {
        if (!editName.trim()) return;

        const newStickerItem = {
            id: uuidv4(),
            name: editName.trim(),
            x: selectedCoords.x,
            y: selectedCoords.y,
            color: editColor
        };

        setStickers([...stickers, newStickerItem]);
        setNewSticker('');
    };

    const handleDelete = (id) => {
        setStickers(stickers.filter(st => st.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const startEditing = (stakeholder) => {
        setEditingId(stakeholder.id);
        setEditName(stakeholder.name);
        setEditColor(stakeholder.color);
    };

    const saveEdit = () => {
        setStickers(stickers.map(st =>
            st.id === editingId ? { ...st, name: editName, color: editColor } : st
        ));
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const svgWidth = 700;
    const svgHeight = 600;
    const padding = 50;

    const scaleX = (x) => padding + (x / 4) * (svgWidth - 2 * padding);
    const scaleY = (y) => svgHeight - padding - (y / 3) * (svgHeight - 2 * padding);

    const saveStickers = () => {
        localStorage.setItem('domainStickers', JSON.stringify(stickers));
    };

    const exportAsImage = async () => {
        const element = importRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'domain-chart.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const savedStickers = localStorage.getItem('domainStickers');
        if (savedStickers) setStickers(JSON.parse(savedStickers));
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Диаграмма доменов
            </Typography>

            <Grid container spacing={4}>
                {/* Левая часть - диаграмма */}
                <Grid item xs={8}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

                    <Box ref={importRef} sx={{userSelect: 'none'}}>
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
                            {/* Areas */}
                            {/* Generic */}
                            <polygon
                                points={`
                                ${scaleX(0)},${scaleY(0)} 
                                ${scaleX(0)},${scaleY(3)} 
                                ${scaleX(1)},${scaleY(3)} 
                                ${scaleX(1)},${scaleY(0)} 
                            `}
                                fill="#A2A2A2"
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
                                GENERIC
                            </text>

                            {/* Support */}
                            <polygon
                                points={`
                                ${scaleX(1)},${scaleY(3)} 
                                ${scaleX(1)},${scaleY(0)} 
                                ${scaleX(4)},${scaleY(0)} 
                                ${scaleX(4)},${scaleY(1)} 
                                ${scaleX(2)},${scaleY(1)} 
                                ${scaleX(2)},${scaleY(3)}
                            `}
                                fill="#9F7DCD"
                                stroke="grey"
                                strokeWidth={2}
                            />
                            <text
                                x={scaleX(1.5)}
                                y={scaleY(1)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={20}
                                fontWeight={700}
                            >
                                SUPPORT
                            </text>

                            {/* Core */}
                            <polygon
                                points={`
                                ${scaleX(2)},${scaleY(1)} 
                                ${scaleX(2)},${scaleY(3)} 
                                ${scaleX(4)},${scaleY(3)} 
                                ${scaleX(4)},${scaleY(1)}
                            `}
                                fill="#76A993"
                                stroke="grey"
                                strokeWidth={2}
                            />
                            <text
                                x={scaleX(3)}
                                y={scaleY(2)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={20}
                                fontWeight={700}
                            >
                                CORE
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
                                Business Differentiation
                            </text>
                            <text
                                x={20}
                                y={svgHeight / 2 + 10}
                                textAnchor="middle"
                                fontSize={14}
                                fontWeight="bold"
                                transform={`rotate(-90, 20, ${svgHeight / 2})`}
                            >
                                Model Complexity
                            </text>

                            {/* Axis ticks */}
                            {[0, 1, 2, 3, 4].map((val) => (
                                <React.Fragment key={`tick${val}`}>
                                    <text
                                        x={scaleX(val)}
                                        y={svgHeight - padding + 20}
                                        textAnchor="middle"
                                        fontSize={12}
                                    >
                                        {['Low', '', '', '', 'High'][val]}
                                    </text>
                                    <text
                                        x={padding - 20}
                                        y={scaleY(val)}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={12}
                                        transform={`rotate(-90, ${padding - 15}, ${scaleY(val)})`}
                                    >
                                        {['', '', '', 'Высокое'][val]}
                                    </text>
                                </React.Fragment>
                            ))}

                            {/* Stickers */}
                            {stickers.map((st) => (
                                <g key={st.id}>
                                    <circle
                                        cx={scaleX(st.x)}
                                        cy={scaleY(st.y)}
                                        r={8}
                                        fill={st.color}
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
                </Grid>

                {/* Правая часть - управление */}
                <Grid item xs={4}>
                    <Box sx={{width: 300 }}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {editingId ? 'Редактирование' : 'Добавление'}
                            </Typography>

                            <TextField
                                label="Domain"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Координаты: {selectedCoords.x.toFixed(1)}, {selectedCoords.y.toFixed(1)}
                            </Typography>

                            <Typography gutterBottom>Color</Typography>
                            <HexColorPicker
                                color={editColor}
                                onChange={(e) => setEditColor(e)}
                                style={{ width: '100%', marginBottom: '20px' }}
                            />

                            {editingId ? (
                                <>
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
                                    <Button
                                        variant="contained"
                                        onClick={handleAddSticker}
                                        fullWidth
                                        disabled={!editName.trim()}
                                    >
                                        Добавить
                                    </Button>
                                </>
                            )}

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Домены ({stickers.length})
                                </Typography>

                                {stickers.length === 0 ? (
                                    <Typography variant="body2">Нет доменов</Typography>
                                ) : (
                                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {stickers.map((st) => (
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
                </Grid>
            </Grid>
        </Box>
    );
};

export default DomainChart;