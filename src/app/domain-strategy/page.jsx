import DomainChart from '@/components/charts/DomainChart';

export const metadata = {
    title: 'Диаграмма доменов',
    description: 'Помощник для разработчик и архитекторов',
};

export default function DomainStrategyPage() {
    return (
        <DomainChart />
    );
}