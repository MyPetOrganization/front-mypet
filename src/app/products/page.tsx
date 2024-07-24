import { useEffect, useState } from "react";
import { Container, Content, Header, Input, Table, Button, IconButton, Grid, Row, Col, ButtonToolbar } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import CrearActualizar from "./components/crearActualizar";
import { columnsProduct, getCookie } from "./components/constants";
import axios from "axios";
import ConfirmationModal from "./components/confirmation";
import { get } from "http";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

// export default function StockProductos({ data: {} }) {
export default function StockProductos() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [dataActualizar, setDataActualizar] = useState({} as Product);
    const [actualizar, setActualizar] = useState(false);
    const [api, setApi] = useState(false);
    const [remove, setRemove] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [data, setData] = useState([] as Product[]);
    const [consult, setConsult] = useState(true);
    const [idDelete, setIdDelete] = useState(0);
    const [loading, setLoading] = useState(false)

    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/products/${localStorage.getItem('id_user')}`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("auth_cookie")}`
                }
            });
            console.log(response);
            setData(response.data);
            setConsult(false);
            // setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            // setLoading(false);
            setConsult(false);
        }
    }

    useEffect(() => {
        if (consult) {
            getProducts();
        }
    }, [consult]);

    const handleInput = (value: string) => {
        setSearchKeyword(value);
        if (value.trim() === '') {
            getProducts();
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/api/products/fobn/${localStorage.getItem('id_user')}`, { name: searchKeyword }, {
                headers: {
                    Authorization: `Bearer ${getCookie('auth_cookie')}`
                }
            });
            console.log(response);
            setData(response.data);
            setConsult(false);
            // setProducts(response.data);
            // setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            // setLoading(false);
            setConsult(false);
        }
    };

    const handleCreate = () => {
        setOpenModal(true);
    };

    const handleUpdate = (product: Product) => {
        console.log(product);
        setActualizar(true);
        setOpenModal(true);
        setDataActualizar(product);
    };

    useEffect(() => {
        if (remove) {
            removeProduct(idDelete);
        }
    }, [remove])


    const handleDelete = (id: number) => {
        setIdDelete(id);
        setConfirmation(true);
    };

    const removeProduct = async (id: number) => {
        if (remove) {
            try {
                const response = await axios.delete(`http://localhost:3001/api/products/${localStorage.getItem('id_user')}`, {
                    headers: {
                        "Authorization": `Bearer ${getCookie("auth_cookie")}`
                    },
                    data: { id: id },
                });
                console.log(response);
                //setData(response.data);
                //setConsult(true);
                setRemove(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                // setLoading(false);
            }
            setConsult(true);
            setIdDelete(0);
        }
    };

    const renderColumns = () => {
        return columnsProduct.map((col, index) => (
            <Column key={index} width={col.width} flexGrow={col.flexGrow || 0}>
                <HeaderCell>{col.header}</HeaderCell>
                <Cell dataKey={col.dataKey} />
            </Column>
        ));
    };

    const mapperTable = () => {
        return data.map((product, index) => ({
            ...product,
            num: index + 1,
            imageUrl: (
                <div className="d-flex justify-content-center">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 100, height: 100 }}
                    />
                </div>

            ),
            actions: (
                <div className="d-flex justify-content-around">
                    <IconButton
                        icon={<TrashIcon />}
                        onClick={() => handleDelete(product.id)}
                    />
                    <IconButton
                        icon={<EditIcon />}
                        onClick={() => handleUpdate(product)}
                    />
                </div>
            )
        }));
    };

    return (
        <>
            <Container>
                <Header>
                    <h2>Stock de productos</h2>
                </Header>
                <Content className="mt-3">
                    <Grid fluid>
                        <Row className="show-grid mb-3">
                            <Col xs={24} sm={24} md={8}>
                                <Input
                                    placeholder="Buscar producto"
                                    value={searchKeyword}
                                    onChange={(event) => handleInput(event)}
                                />
                            </Col>
                            <Col>
                                <ButtonToolbar>
                                    <IconButton
                                        icon={<SearchIcon />}
                                        size="md"
                                        className="ms-2"
                                        onClick={handleSearch}
                                    />

                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <IconButton
                                    icon={<PlusIcon />}
                                    size="md"
                                    onClick={handleCreate}
                                >
                                    Nuevo producto
                                </IconButton>
                            </Col>
                        </Row>
                    </Grid>

                    <Table
                        data={mapperTable()}
                        height={400}
                        wordWrap
                        rowKey="id"
                        bordered
                        cellBordered
                        loading={loading}
                        className="mt-3"
                    >
                        {renderColumns()}
                    </Table>
                </Content>
            </Container>

            {openModal &&
                <CrearActualizar
                    open={openModal}
                    setOpen={setOpenModal}
                    actualizar={actualizar}
                    setActualizar={setActualizar}
                    dataActual={dataActualizar}
                    setConsult={setConsult}
                />
            }

            {confirmation &&
                <ConfirmationModal
                    open={confirmation}
                    setOpen={setConfirmation}
                    setRemove={setRemove}
                />
            }
        </>
    );
}