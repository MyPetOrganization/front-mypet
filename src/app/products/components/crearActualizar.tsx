"use client"

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, Schema, Grid, Col, Row, IconButton } from 'rsuite';
import axios from 'axios';
import { getCookie } from './constants';
import { URL_BASE } from '@/config';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';

interface CrearActualizarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    actualizar?: boolean;
    setActualizar?: (actualizar: boolean) => void;
    dataActual?: any;
    setConsult?: (consult: boolean) => void;
};

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
    name: StringType().isRequired(),
    price: NumberType().isRequired(),
});

interface TextFieldProps {
    name: string;
    label: string;
    accepter?: any;
}

const TextField = forwardRef((props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { name, label, accepter, ...rest } = props;
    return (
        <Form.Group ref={ref}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} {...rest} />
        </Form.Group>
    );
});

const CrearActualizar: React.FC<CrearActualizarProps> = ({ open, setOpen, actualizar, setActualizar, dataActual, setConsult }) => {
    const [showModal, setShowModal] = useState(open);
    const formRef = useRef(null);
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        name: '',
        price: "",
    });


    useEffect(() => {
        if (actualizar) {
            setFormValue(dataActual);
        }
    }, [actualizar])


    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        setShowModal(open);
    }, [open]);

    const close = () => {
        setShowModal(false);
        setOpen(false);
        setActualizar(false);
    };

    const handleSubmit = async () => {
        if (!formRef.current.check()) {
            // console.error('Form Error');
            return;
        }
        console.log(formValue, 'Form Value');
        console.log(imageFile, 'Image File');

        try {
            const formData = new FormData();
            formData.append('name', formValue.name);
            formData.append('price', formValue.price);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            formData.append('userId', localStorage.getItem('id_user') || '');
            formData.append('imageUrl', "");

            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            // console.log("TOKEN: ", getCookie('auth_cookie'));
            const response = await axios.post(`${URL_BASE}products/${localStorage.getItem('id_user')}`, formData, {
                headers: {
                    Authorization: `Bearer ${getCookie('auth_cookie')}`
                }
            });
            // console.log(response.data);
            // setConsult(true);

            setFormValue({
                name: '',
                price: '',
            });
            setImageFile(null);
            setPreviewUrl(null);
            close();
        } catch (error) {
            console.error(error);
        }
        setConsult(true);

    };

    const handleUpdate = async () => {
        if (!formRef.current.check()) {
            // console.error('Form Error');
            return;
        }
        console.log(formValue, 'Form Value');
        console.log(imageFile, 'Image File');

        try {
            const formData = new FormData();
            formData.append('name', formValue.name);
            formData.append('price', formValue.price);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            formData.append('id', dataActual.id);

            // let params: Partial<typeof dataActual> = {
            //     name: formValue.name,
            //     price: formValue.price,
            //     imageUrl: dataActual.imageUrl,
            // };

            // console.log("Valores finales", params)

            const response = await axios.patch(`${URL_BASE}products/${dataActual.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getCookie('auth_cookie')}`
                }
            });
            // setConsult(true);

            setFormValue({
                name: '',
                price: '',
            });
            setImageFile(null);
            setPreviewUrl(null);
            close();
        } catch (error) {
            console.error(error);
        }
        setConsult(true);
    };

    return (
        <Modal size="sm" open={showModal} onClose={close}>
            <Modal.Header>
                <Modal.Title style={{ color: "#FE5028" }}>{actualizar ? "Actualizar" : "Crear"} Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    ref={formRef}
                    onChange={setFormValue}
                    formValue={formValue}
                    model={model}
                    className='mx-3'
                >
                    <Grid fluid>
                        <Row>
                            <Col sm={24} md={12}>
                                <TextField name="name" label="Nombre" />
                                <TextField name="price" label="PVP" />
                            </Col>
                            <Col md={12}>
                                <Form.Group className='ms-4'>
                                    <Form.ControlLabel>Foto del producto</Form.ControlLabel>
                                    <div className="flex flex-col items-center mt-4">
                                        <label className="cursor-pointer text-white py-2 px-4 rounded mb-2" style={{ background: "#FE5028" }}>
                                            Subir imagen
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex flex-col items-center">
                                            {previewUrl ? (
                                                <img
                                                    src={dataActual.imageUrl || previewUrl}
                                                    alt="Preview"
                                                    className="w-12 h-34 object-cover rounded mb-2"
                                                />
                                            ) : (
                                                <p className="text-gray-500 mb-2">No hay imagen seleccionada</p>
                                            )}
                                            {imageFile && <p className="text-sm text-gray-700 w-75">{imageFile.name}</p>}
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Grid>
                    <Form.Group className='d-flex justify-content-end'>
                        <IconButton 
                            appearance="primary"
                            color='green'
                            icon={<CheckOutlineIcon />}
                            onClick={actualizar ? handleUpdate : handleSubmit}
                        >
                            Guardar
                        </IconButton>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CrearActualizar;