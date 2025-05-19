import InfluenceMatrix from '@/components/charts/InfluenceMatrix';

export const metadata = {
    title: 'Матрица влияния',
    description: 'Помощник для разработчик и архитекторов',
};

export default function InfluenceMatrixPage() {
    return (
        <InfluenceMatrix />
    );
}