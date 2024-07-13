interface ColumnConfig {
    width: number;
    header: string;
    dataKey: string;
    flexGrow?: number;
}

const columnsProduct: ColumnConfig[] = [
    { width: 100, header: 'No', dataKey: 'num' },
    { width: 300, header: 'Nombre', dataKey: 'name', flexGrow: 1},
    { width: 150, header: 'Precio', dataKey: 'price' },
    { width: 300, header: 'Imagen', dataKey: 'imageUrl', flexGrow: 1},
    { width: 150, header: 'Acciones', dataKey: 'actions' }
];

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

export { columnsProduct, getCookie };