import ArchitectureTable from '@/components/tables/ArchitectureTable';
import archTable from '@/data/table.json';
import characteristicsData from '@/data/characteristics.json';

export const metadata = {
    title: 'Архитектурные стили',
    description: 'Помощник для разработчик и архитекторов',
};


export default function ArchitectureStylesPage() {
    return (
        <ArchitectureTable
            data={archTable}
            characteristicsData={characteristicsData}
        />
    );
}
