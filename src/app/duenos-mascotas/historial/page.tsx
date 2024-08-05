'use client'

import { Container, Content, Header, Table } from "rsuite";

import 'rsuite/dist/rsuite.min.css';

const { Column, HeaderCell, Cell } = Table;

const data = [
    { id: 1, product: 'Comida para Perro', category: 'Alimentos', price: 20.99, date: '2023-07-01' },
    { id: 2, product: 'Juguete para Gato', category: 'Juguetes', price: 5.99, date: '2023-07-02' },
    { id: 3, product: 'Jaula para Pájaros', category: 'Accesorios', price: 45.00, date: '2023-07-03' },
    { id: 4, product: 'Acuario', category: 'Accesorios', price: 100.00, date: '2023-07-04' },
    { id: 5, product: 'Collar para Perro', category: 'Accesorios', price: 15.00, date: '2023-07-05' },
    { id: 6, product: 'Arena para Gato', category: 'Higiene', price: 10.50, date: '2023-07-06' },
    { id: 7, product: 'Rueda para Hámster', category: 'Juguetes', price: 7.99, date: '2023-07-07' },
    { id: 8, product: 'Correa para Perro', category: 'Accesorios', price: 12.00, date: '2023-07-08' },
    { id: 9, product: 'Semillas para Pájaros', category: 'Alimentos', price: 8.99, date: '2023-07-09' },
    { id: 10, product: 'Comida para Peces', category: 'Alimentos', price: 4.99, date: '2023-07-10' },
    { id: 11, product: 'Rascador para Gato', category: 'Juguetes', price: 25.00, date: '2023-07-11' },
    { id: 12, product: 'Cama para Perro', category: 'Accesorios', price: 50.00, date: '2023-07-12' },
    { id: 13, product: 'Cama para Gato', category: 'Accesorios', price: 30.00, date: '2023-07-13' },
    { id: 14, product: 'Baño para Pájaros', category: 'Accesorios', price: 20.00, date: '2023-07-14' },
    { id: 15, product: 'Jaula para Hámster', category: 'Accesorios', price: 35.00, date: '2023-07-15' },
    { id: 16, product: 'Golosinas para Perro', category: 'Alimentos', price: 5.99, date: '2023-07-16' },
    { id: 17, product: 'Golosinas para Gato', category: 'Alimentos', price: 6.99, date: '2023-07-17' },
    { id: 18, product: 'Filtro para Acuario', category: 'Accesorios', price: 15.00, date: '2023-07-18' },
    { id: 19, product: 'Percha para Pájaros', category: 'Accesorios', price: 10.00, date: '2023-07-19' },
    { id: 20, product: 'Comida para Hámster', category: 'Alimentos', price: 3.99, date: '2023-07-20' }
];

export default function Historial() {
    return (
        <Container style={{ height: "85vH" }}>
            <Header>
                <h2 style={{ color: "#FE5028" }}>Historial de compras</h2>
            </Header>
            <Content className="mt-2" style={{ height: "100vH" }}>
                <Table 
                    height={500}
                    data={data}
                    bordered
                    cellBordered
                >
                    <Column width={100} align="center" fixed>
                        <HeaderCell style={{ fontWeight: "bolder", fontSize: "14px" }}>ID</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>

                    <Column width={300} fixed>
                        <HeaderCell style={{ fontWeight: "bolder", fontSize: "14px" }}>Nombre del producto</HeaderCell>
                        <Cell dataKey="product" />
                    </Column>

                    <Column width={300}>
                        <HeaderCell style={{ fontWeight: "bolder", fontSize: "14px" }}>Categoria</HeaderCell>
                        <Cell dataKey="category" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell style={{ fontWeight: "bolder", fontSize: "14px" }}>Precio</HeaderCell>
                        <Cell dataKey="price">
                            {rowData => `$${rowData.price.toFixed(2)}`}
                        </Cell>
                    </Column>

                    <Column width={200} flexGrow={1}>
                        <HeaderCell style={{ fontWeight: "bolder", fontSize: "14px" }}>Fecha</HeaderCell>
                        <Cell dataKey="date" />
                    </Column>
                </Table>
            </Content>
        </Container>
    )
}