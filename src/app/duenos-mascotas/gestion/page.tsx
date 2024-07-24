import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Container,
    Content,
    Header,
    Loader,
    Message,
    Uploader,
    useToaster,
    Modal,
    Button,
    ButtonToolbar,
    Tooltip,
    Whisper,
    Form,
    Schema,
    Row,
    Col,
    IconButton,
    PanelGroup,
    Panel,
    Input,
    InputGroup,
    ButtonGroup,
    Notification
} from "rsuite";
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import BlockIcon from '@rsuite/icons/Block';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import PlusIcon from '@rsuite/icons/Plus';
import RemindIcon from '@rsuite/icons/legacy/Remind';

import 'rsuite/dist/rsuite.min.css';
import HttpService from "@/helpers/HttpService";
import NotificationContext from "@/context/NotificationContext";
import { set } from "rsuite/esm/internals/utils/date";

function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

const { StringType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('This field is required.'),
    password: StringType()
        .minLength(8, 'La contraseña debe tener al menos 8 caracteres')
        .pattern(/(?=.*[A-Z])/, 'La contraseña debe tener al menos una letra mayúscula')
        .pattern(/(?=.*[a-z])/, 'La contraseña debe tener al menos una letra minúscula')
        .pattern(/(?=.*[0-9])/, 'La contraseña debe tener al menos un número')
        .pattern(/(?=.*[!@#$%^&*])/, 'La contraseña debe tener al menos un carácter especial'),
});

const modelCard = Schema.Model({
    cardName: StringType()
        .isRequired('El nombre en la tarjeta es requerido.')
        .minLength(3, 'El nombre en la tarjeta debe tener al menos 3 caracteres.'),
    cardNumber: StringType()
        .isRequired('El número de tarjeta es requerido.')
        .pattern(/^[a-zA-Z0-9]+$/, 'El número de tarjeta debe tener 16 dígitos.'),
    expirationDate: StringType()
        .isRequired('La fecha de expiración es requerida.')
        .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'La fecha de expiración debe tener el formato MM/YY.'),
    cvv: StringType()
        .isRequired('El CVV es requerido.')
        .pattern(/^[0-9]{3,4}$/, 'El CVV debe tener 3 o 4 dígitos.')
});

const modelCardUpdate = Schema.Model({
    cardName: StringType()
        .isRequired('El nombre en la tarjeta es requerido.')
        .minLength(3, 'El nombre en la tarjeta debe tener al menos 3 caracteres.'),
    cardNumber: StringType()
        .isRequired('El número de tarjeta es requerido.')
        .pattern(/^[a-zA-Z0-9]+$/, 'El número de tarjeta debe tener 16 dígitos.')
});

export default function GestionCuenta() {
    const { showNotification } = useContext(NotificationContext)

    const toaster = useToaster();
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const formRef = useRef();
    const [formError, setFormError] = useState({});
    const [visible, setVisible] = useState(false);
    const [tarjetas, setTarjetas] = useState([]);
    const [showCardsModal, setShowCardsModal] = useState(false);
    const [formValue, setFormValue] = useState({
        name: "",
        email: "",
        password: ""
    });

    const formCardRef = useRef();
    const [formCardError, setFormCardError] = useState({});
    const [updateCard, setUpdateCard] = useState(false);
    const [deleteCard, setDeleteCard] = useState(false);
    const [numberForDel, setNumberForDel] = useState(0);
    const [formCardValue, setFormCardValue] = useState({
        cardName: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });

    const handleChange = () => {
        setVisible(!visible);
    };

    const handleUpload = (file) => {
        setUploading(true);
        previewFile(file.blobFile, value => {
            setFileInfo(value);
            setUploading(false);
        });
    };

    const handleRemove = () => {
        setFileInfo(null);
        toaster.push(<Message type="info">Foto eliminada</Message>);
    };

    const handlePreview = () => {
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            toaster.push(<Message type="error">Error</Message>);
            return;
        }
        let formData = new FormData();
        if (formValue.name) {
            formData.append('name', formValue.name);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }
        if (formValue.password) {
            formData.append('password', formValue.password);
        }

        setFormValue({
            ...formValue,
            password: ""
        }); // Limpiar campos

        handleUpdateBuyer(formData);
        // console.log(formValue);
        // console.log(imageFile);
    };

    const handleSubmitFormCard = () => {
        if (!formCardRef.current.check()) {
            toaster.push(<Message type="error">Error</Message>);
            return;
        }

        if (updateCard) {
            updateDataCard({ cardName: formCardValue.cardName, cardNumber: parseInt(formCardValue.cardNumber) });
        } else {
            handleCreateCard(formCardValue);
        }
    };

    const handleKeyPress = (event) => {
        const charCode = event.charCode;
        // Verificar si la tecla presionada es una letra o un espacio
        if (
            !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
            !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
            !(charCode === 32) || // Espacio
            formValue.name.length > 40
        ) {
            event.preventDefault();
        }
    };

    const handleCancel = () => {
        setFormValue({
            ...formValue,
            password: ""
        });
        setFileInfo(null);
        getInfoBuyer();
    };

    const maskCardNumber = (number: string) => {
        return number.substring(0, 4) + '*'.repeat(number.length - 4);
    }

    const handleUpdateCard = (card: Object) => {
        setUpdateCard(true);
        setFormCardValue({
            cardName: card.cardName,
            cardNumber: card.cardNumber,
            expirationDate: card.expirationDate,
            cvv: card.cvv,
        });
        setShowCardsModal(true);
    }

    const handleCloseModalCard = () => {
        setShowCardsModal(false)
        setUpdateCard(false);
        setFormCardValue({
            cardName: "",
            cardNumber: "",
            expirationDate: "",
            cvv: "",
        });
    }

    // Peticiones a las API
    const getInfoBuyer = () => {
        HttpService
            .get(`users/${localStorage.getItem('id_user')}`)
            .then((response) => {
                if (response.status === 200) {
                    setFormValue({
                        ...formValue,
                        name: response.data.name,
                        email: response.data.email,
                    });

                    setFileInfo(response.data.profileImage);
                } else {
                    showNotification({
                        msj: "No se pudo obtener la información del usuario",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    };

    useEffect(() => {
        getInfoBuyer();
        getCards();
    }, [])

    const handleUpdateBuyer = (payload: FormData) => {
        HttpService
            .patch(`users/${localStorage.getItem('id_user')}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    showNotification({
                        msj: "Datos actualizados correctamente",
                        open: true,
                        status: 'success'
                    })
                } else {
                    showNotification({
                        msj: "No se pudo actualizar la información del usuario",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    };

    const getCards = () => {
        HttpService
            .get(`cards/${localStorage.getItem('id_user')}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setTarjetas(response.data);
                } else {
                    showNotification({
                        msj: "No se pudieron obtener las tarjetas asociadas",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    };

    const handleCreateCard = (payload: Object) => {
        HttpService
            .post(`cards/${localStorage.getItem('id_user')}`,
                { ...payload, cardNumber: parseInt(payload.cardNumber), userId: parseInt(localStorage.getItem('id_user')) }
            )
            .then((response) => {
                if (response.status === 201) {
                    setShowCardsModal(false);
                    getCards();

                    showNotification({
                        msj: "Tarjeta registrada correctamente",
                        open: true,
                        status: 'success'
                    })

                    setFormCardValue({
                        cardName: "",
                        cardNumber: "",
                        expirationDate: "",
                        cvv: "",
                    });
                } else {
                    showNotification({
                        msj: "No se pudo registrar la tarjeta",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    }

    const updateDataCard = (payload: Object) => {
        HttpService
            .patch(`cards/${localStorage.getItem('id_user')}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    setShowCardsModal(false);
                    getCards();

                    showNotification({
                        msj: "Tarjeta actualizada correctamente",
                        open: true,
                        status: 'success'
                    })

                    setFormCardValue({
                        cardName: "",
                        cardNumber: "",
                        expirationDate: "",
                        cvv: "",
                    });
                    setUpdateCard(false);
                } else {
                    showNotification({
                        msj: "No se pudo actualizar la tarjeta",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    }

    const handleDeleteCard = (cardNumber: number) => {
        console.log(cardNumber);
        setNumberForDel(cardNumber);
        setDeleteCard(true);
    }

    const deleteDataCard = () => {
        HttpService
            .delete(`cards/${localStorage.getItem('id_user')}`, ({ cardNumber: numberForDel }))
            .then((response) => {
                if (response.status === 204) {
                    getCards();

                    showNotification({
                        msj: "Tarjeta eliminada correctamente",
                        open: true,
                        status: 'success'
                    })
                    setNumberForDel(0);
                } else {
                    showNotification({
                        msj: "No se pudo eliminar la tarjeta",
                        open: true,
                        status: 'error'
                    })
                }
                // console.log(response);
            })
            .catch((error) => {
                console.error(error);
                showNotification({
                    msj: error.message,
                    open: true,
                    status: 'error'
                })
            });
    }

    return (
        <>
            <Modal backdrop="static" role="alertdialog" open={deleteCard} onClose={() => setDeleteCard(false)} size="xs">
                <Modal.Body>
                    <RemindIcon style={{ color: '#ffb300', fontSize: 24 }} />
                    ¿Está seguro de eliminar la tarjeta?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteDataCard} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={() => setDeleteCard(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container>
                <Header>
                    <h2>Cuenta MyPet</h2>
                </Header>
                <Content className="mt-2">
                    <Uploader
                        fileListVisible={false}
                        listType="picture"
                        action=""
                        accept="image/*"
                        onUpload={handleUpload}
                        className="d-flex justify-content-center"
                        onSuccess={(response, file) => {
                            toaster.push(<Message type="success">Foto cargada exitosamente.</Message>);
                            setImageFile(file.blobFile);
                        }}
                        onError={(error, file) => {
                            setFileInfo(null);
                            setUploading(false);
                            toaster.push(<Message type="error">Upload failed: {error.message}</Message>);
                            console.error('Upload error:', error);
                        }}
                    >
                        <Whisper placement="top" speaker={<Tooltip>Presiona para cargar una foto</Tooltip>}>
                            <Button style={{ width: 200, height: 200, position: 'relative' }}>
                                {uploading && <Loader backdrop center />}
                                {fileInfo ? (
                                    <img src={fileInfo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <AvatarIcon style={{ fontSize: 80 }} />
                                )}
                            </Button>
                        </Whisper>
                    </Uploader>

                    {fileInfo && (
                        <ButtonToolbar className="mt-2 d-flex justify-content-center">
                            <Button appearance="primary" color="green" onClick={handlePreview}>Ver Foto</Button>
                            <Button appearance="primary" color="red" onClick={handleRemove}>Eliminar Foto</Button>
                        </ButtonToolbar>
                    )}

                    <Row className="mx-4">
                        <Col xs={24} sm={24} md={10} className="mt-3">
                            <Panel bordered>
                                <h5>DATOS PERSONALES</h5>
                                <Form
                                    fluid
                                    ref={formRef}
                                    onChange={setFormValue}
                                    onCheck={setFormError}
                                    formValue={formValue}
                                    model={model}
                                    className="my-3"
                                >
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>Nombre</Form.ControlLabel>
                                        <Form.Control name="name" onKeyPress={handleKeyPress} />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.ControlLabel>Email</Form.ControlLabel>
                                        <Form.Control name="email" type="email" disabled />
                                    </Form.Group>
                                    <Form.Group controlId="password">
                                        <Form.ControlLabel>Password</Form.ControlLabel>
                                        <InputGroup inside>
                                            <Form.Control
                                                name="password"
                                                autoComplete="off"
                                                accepter={Input}
                                                type={visible ? 'text' : 'password'}
                                            />
                                            <InputGroup.Button onClick={handleChange}>
                                                {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>

                            </Panel>
                        </Col>

                        <Col xs={24} sm={24} md={14} className="mt-3">
                            <Panel bordered>
                                <div className="d-flex justify-content-between">
                                    <h5>TARJETAS ASOCIADAS</h5>
                                    <IconButton color="blue" appearance="primary" icon={<PlusIcon />}
                                        onClick={() => setShowCardsModal(true)}
                                    >
                                        Crear
                                    </IconButton>
                                </div>
                                <PanelGroup accordion bordered
                                    className="my-3"
                                    style={{ height: "228px", overflowY: "auto" }}
                                >
                                    {tarjetas.map((tarjeta, index) => (
                                        <Panel header={<h5>{tarjeta.cardName}</h5>} eventKey={index + 1} key={index}>
                                            <Row className="show-grid">
                                                <Col xs={24} sm={24} md={19}>
                                                    <h6>Número de tarjeta:</h6>
                                                    <p className="ms-2">{maskCardNumber((tarjeta.cardNumber).toString())}</p>
                                                    <hr style={{ border: "solid 2px #053BA6" }} />
                                                    <h6>Fecha de expiración:</h6>
                                                    <p className="ms-2">{tarjeta.expirationDate}</p>
                                                </Col>
                                                <Col xs={24} sm={24} md={5}>
                                                    <ButtonGroup vertical>
                                                        <IconButton color="green" appearance="primary" icon={<EditIcon />}
                                                            className="mb-2"
                                                            onClick={() => handleUpdateCard(tarjeta)}
                                                        />
                                                        <IconButton color="red" appearance="primary" icon={<TrashIcon />}
                                                            onClick={() => handleDeleteCard(parseInt(tarjeta.cardNumber))}
                                                        />
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </Panel>
                                    ))}

                                </PanelGroup>

                            </Panel>

                        </Col>
                    </Row>

                    <ButtonToolbar className="mt-3 d-flex justify-content-center">
                        <IconButton
                            appearance="primary"
                            color="green"
                            icon={<CheckOutlineIcon />}
                            style={{ width: "160px" }}
                            onClick={handleSubmit}
                        >
                            Guardar Cambios
                        </IconButton>
                        <IconButton
                            appearance="primary"
                            color="red"
                            icon={<BlockIcon />}
                            style={{ width: "160px" }}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </IconButton>
                    </ButtonToolbar>

                </Content>
            </Container>

            <Modal open={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Header>
                    <Modal.Title>Vista Previa de la Foto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fileInfo && <img src={fileInfo} style={{ width: '100%' }} />}
                </Modal.Body>
            </Modal>

            <Modal open={showCardsModal} onClose={() => setShowCardsModal(false)} size="sm" >
                <Modal.Header>
                    <Modal.Title>{updateCard ? "Actualizar" : "Registrar"} tarjeta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        ref={formCardRef}
                        onChange={setFormCardValue}
                        onCheck={setFormCardError}
                        formValue={formCardValue}
                        model={updateCard ? modelCardUpdate : modelCard}
                    // className="my-3"
                    >
                        <Form.Group controlId="cardName">
                            <Form.ControlLabel>Nombre de la tarjeta</Form.ControlLabel>
                            <Form.Control name="cardName" />
                        </Form.Group>

                        <Form.Group controlId="cardNumber">
                            <Form.ControlLabel>Número de tarjeta</Form.ControlLabel>
                            {/* <Form.Control name="cardNumber" onKeyPress={handleKeyPress} /> */}
                            <Form.Control name="cardNumber" />
                        </Form.Group>

                        {!updateCard && (
                            <>
                                <Form.Group controlId="expirationDate">
                                    <Form.ControlLabel>Fecha de expiración</Form.ControlLabel>
                                    <Form.Control name="expirationDate" />
                                </Form.Group>

                                <Form.Group controlId="cvv">
                                    <Form.ControlLabel>Código de seguridad</Form.ControlLabel>
                                    <Form.Control name="cvv" />
                                </Form.Group>
                            </>
                        )

                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar className="d-flex justify-content-center">
                        <IconButton
                            appearance="primary"
                            color="green"
                            icon={<CheckOutlineIcon />}
                            style={{ width: "160px" }}
                            onClick={handleSubmitFormCard}
                        >
                            Guardar Cambios
                        </IconButton>
                        <IconButton
                            appearance="primary"
                            color="red"
                            icon={<BlockIcon />}
                            style={{ width: "160px" }}
                            onClick={handleCloseModalCard}
                        >
                            Cancelar
                        </IconButton>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        </>
    );
}
