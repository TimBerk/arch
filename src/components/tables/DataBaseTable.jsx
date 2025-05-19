"use client";

import React, {useMemo, useState} from 'react';
import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme
} from '@mui/material';

const DatabaseComparisonTable = ({data}) => {
    const theme = useTheme();
    const [selectedMetrics, setSelectedMetrics] = useState([]);

    // Process data - include Read/Write in display but exclude from calculations
    const { characteristics, dbTypes, transposedData, readWriteData } = useMemo(() => {
        const dbTypes = Object.keys(data.architectures);
        const allCharacteristics = Object.keys(data.architectures[dbTypes[0]] || {});

        // Separate Read/Write from other characteristics
        const readWriteChar = allCharacteristics.find(c => c.includes('Read/Write'));
        const otherCharacteristics = allCharacteristics.filter(c => !c.includes('Read/Write'));

        const transposedData = otherCharacteristics.map(char => ({
            characteristic: char,
            ...Object.fromEntries(dbTypes.map(db => [db, data.architectures[db][char]]))
        }));

        const readWriteRow = readWriteChar ? {
            characteristic: readWriteChar,
            ...Object.fromEntries(dbTypes.map(db => [db, data.architectures[db][readWriteChar]]))
        } : null;

        return {
            characteristics: otherCharacteristics,
            dbTypes,
            transposedData,
            readWriteData: readWriteRow
        };
    }, [data.architectures]);

    const handleMetricSelect = (characteristic) => {
        setSelectedMetrics(prev =>
            prev.includes(characteristic)
                ? prev.filter(c => c !== characteristic)
                : [...prev, characteristic]
        );
    };

    const calculate = (dbType) => {
        if (selectedMetrics.length === 0) return '-';
        return selectedMetrics.reduce(
            (acc, char) => acc + (data.architectures[dbType][char] || 0),
            0
        );
    };

    return (
        <TableContainer sx={{
            mt: 4,
            maxWidth: '100%',
            overflowX: 'auto',
        }} component={Paper}>
            <Table stickyHeader aria-label="Database comparison table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.grey[100],
                            position: 'sticky',
                            left: 0,
                            zIndex: 2,
                            width: 300
                        }}>
                            Characteristics
                        </TableCell>
                        {dbTypes.map(db => (
                            <TableCell
                                key={db}
                                align="center"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.grey[100],
                                    minWidth: 120
                                }}
                            >
                                {db}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* Main characteristics with checkboxes */}
                    {transposedData.map((row) => (
                        <TableRow key={row.characteristic} hover>
                            <TableCell
                                sx={{
                                    fontWeight: 500,
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Checkbox
                                    size="small"
                                    checked={selectedMetrics.includes(row.characteristic)}
                                    onChange={() => handleMetricSelect(row.characteristic)}
                                />
                                {row.characteristic}
                            </TableCell>
                            {dbTypes.map(db => (
                                <TableCell
                                    key={`${row.characteristic}-${db}`}
                                    align="center"
                                    sx={{
                                        color: row[db] >= 4
                                            ? theme.palette.success.main
                                            : row[db] <= 2
                                                ? theme.palette.warning.main
                                                : 'inherit'
                                    }}
                                >
                                    {row[db]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}

                    {/* Read/Write priority row (no checkbox) */}
                    {readWriteData && (
                        <TableRow hover>
                            <TableCell
                                sx={{
                                    fontWeight: 500,
                                    position: 'sticky',
                                    left: 0,
                                    backgroundColor: 'background.paper',
                                    pl: 4.5 // Align with checkboxes
                                }}
                            >
                                {readWriteData.characteristic}
                            </TableCell>
                            {dbTypes.map(db => (
                                <TableCell
                                    key={`readwrite-${db}`}
                                    align="center"
                                >
                                    {readWriteData[db]}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}

                    {/* Calculation row (excludes Read/Write) */}
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                        <TableCell sx={{
                            fontWeight: 600,
                            position: 'sticky',
                            left: 0,
                            backgroundColor: theme.palette.grey[100]
                        }}>
                            Selected
                        </TableCell>
                        {dbTypes.map(db => (
                            <TableCell
                                key={`calc-${db}`}
                                align="center"
                                sx={{ fontWeight: 600 }}
                            >
                                {calculate(db)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DatabaseComparisonTable;