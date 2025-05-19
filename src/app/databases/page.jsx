import DataBaseTable from '@/components/tables/DataBaseTable';
import dataDB from '@/data/table-db.json';

export const metadata = {
    title: 'Базы данных',
    description: 'Помощник для разработчик и архитекторов',
};

export default function DatabasesPage() {
    return (
        <DataBaseTable data={dataDB} />
    );
}

