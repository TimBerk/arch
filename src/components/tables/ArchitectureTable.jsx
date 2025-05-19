"use client";

import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography, Checkbox, Box, Tooltip, IconButton, TableFooter, FormControlLabel, Switch
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const characteristicLabels = {
    agility: "Agility",
    abstraction: "Abstraction",
    configurability: "Configurability",
    cost: "Cost",
    deployability: "Deployability",
    domain_part: "Domain Partitioning",
    elasticity: "Elasticity",
    evolvability: "Evolvability",
    "fault-tolerance": "Fault Tolerance",
    interation: "Interaction",
    interoperability: "Interoperability",
    maintainability: "Maintainability",
    modifiability: "Modifiability",
    modularity: "Modularity",
    performance: "Performance",
    reliablity: "Reliability",
    scalability: "Scalability",
    security: "Security",
    simplicity: "Simplicity",
    testability: "Testability",
    workflow: "Workflow"
};

const StarRating = ({ value }) => {
    const maxStars = 5;
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {[...Array(maxStars)].map((_, i) => (
                <Typography
                    key={i}
                    component="span"
                    sx={{
                        color: i < value ? '#ffc107' : '#e0e0e0',
                        fontSize: '1.2rem'
                    }}
                >
                    {i < value ? '★' : '☆'}
                </Typography>
            ))}
        </Box>
    );
};

export default function ArchitectureComparisonTable({ data, characteristicsData }) {
    const architectures = useMemo(() => Object.keys(data.architectures), [data]);
    const characteristics = useMemo(() => {
        if (architectures.length === 0) return [];
        return Object.keys(data.architectures[architectures[0]]);
    }, [architectures, data]);

    // Get color based on value (1-5 scale)
    const getValueColor = (value) => {
        if (value >= 4) return '#4caf50'; // Green for good
        if (value <= 2) return '#f44336'; // Red for bad
        return '#ff9800'; // Orange for medium
    };

    // State for row selections
    const [selectedRows, setSelectedRows] = useState(
        characteristics.reduce((acc, char) => ({ ...acc, [char]: false }), {})
    );
    // Calculate column totals for selected rows
    const columnTotals = useMemo(() => {
        const totals = {};
        architectures.forEach(arch => {
            totals[arch] = characteristics.reduce((sum, char) => {
                return selectedRows[char] ? sum + data.architectures[arch][char] : sum;
            }, 0);
        });
        return totals;
    }, [selectedRows, data, architectures, characteristics]);

    // Count of selected characteristics
    const selectedCount = Object.values(selectedRows).filter(Boolean).length;

    const toggleRowSelection = (characteristic) => {
        setSelectedRows(prev => ({
            ...prev,
            [characteristic]: !prev[characteristic]
        }));
    };

    return (
        <TableContainer sx={{
            mt: 4,
            maxWidth: '100%',
            overflowX: 'auto',
            maxHeight: '70vh',
        }} component={Paper}>
            <Table size="small" stickyHeader >
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell sx={{ minWidth: 200 }}></TableCell>
                        {architectures.map(arch => (
                            <TableCell key={arch} align="center" sx={{ fontWeight: 'bold' }}>
                                {arch.replace(/_/g, ' ').toUpperCase()}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {characteristics.map(char => (
                        <TableRow key={char}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedRows[char] || false}
                                    onChange={() => toggleRowSelection(char)}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                {characteristicLabels[char] || char}
                                <Tooltip
                                    title={characteristicsData[char].description}
                                    arrow
                                    placement="right"
                                >
                                    <IconButton size="small" sx={{ ml: 1 }}>
                                        <HelpOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            {architectures.map(arch => (
                                <TableCell key={`${arch}-${char}`} align="center">
                                    <StarRating value={data.architectures[arch][char]} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {/* Calculation Row */}
                    <TableRow sx={{ backgroundColor: '#f0f0f0'}}>
                        <TableCell colSpan={2} sx={{
                            fontWeight: 600,
                            position: 'sticky',
                            left: 0,
                        }}>
                            {`Selected (${selectedCount} stars)`}
                        </TableCell>
                        {architectures.map(arch => (
                            <TableCell
                                key={`total-${arch}`}
                                align="center"
                                sx={{ fontWeight: 600 }}
                            >
                                {selectedCount > 0 ? columnTotals[arch] : '-'}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}