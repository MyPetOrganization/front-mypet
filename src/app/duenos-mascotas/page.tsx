'use client'

import {
    Container,
    Header,
    Sidebar,
    Sidenav,
    Content,
    Navbar,
    Nav,
    Button
} from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import DashboardIcon from '@rsuite/icons/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldDog } from '@fortawesome/free-solid-svg-icons'
import GestionCuenta from './gestion/page';
import Historial from './historial/page';

const headerStyles = {
    padding: 18,
    fontSize: 16,
    height: 56,
    background: '#34c3ff',
    color: ' #fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
};

const NavToggle = ({ expand, onChange, handleLogout }: { expand: boolean, onChange: () => void, handleLogout: () => void }) => {

    return (
        <Navbar appearance="subtle" className="nav-toggle">
            <Nav>
                <Nav.Menu
                    noCaret
                    placement="topStart"
                    trigger="click"
                    title={<CogIcon style={{ width: 20, height: 20 }} />}
                >
                    <Nav.Item>
                        <Button onClick={handleLogout}>
                            Sign out
                        </Button>
                    </Nav.Item>
                </Nav.Menu>
            </Nav>

            <Nav pullRight>
                <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
                    {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default function DuenosMascota() {
    const [expand, setExpand] = useState(true);
    const [openTab, setOpenTab] = useState("1");
    const router = useRouter();

    const handleSelect = (eventKey: string) => {
        setOpenTab(eventKey);
    };

    const handleLogout = () => {
        document.cookie = "auth_cookie=; Max-Age=-99999999;";
        document.cookie = "role=; Max-Age=-99999999;";
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="sidebar-page">
            <Container>
                <Sidebar
                    style={{ display: 'flex', flexDirection: 'column', border: "1px solid #4F979C" }}
                    width={expand ? 240 : 70}
                    collapsible
                >
                    <Sidenav.Header>
                        <div style={headerStyles} className='align-middle'>
                            <FontAwesomeIcon icon={faShieldDog} fontSize={30} />
                            {expand ? <span style={{ marginLeft: 12 }} className='fw-bolder fs-5'>Configuración</span> : ""}
                        </div>
                    </Sidenav.Header>
                    <Sidenav
                        expanded={expand}
                        defaultOpenKeys={['3']}
                        appearance="subtle"
                        style={expand ? { height: "82vh" } : { height: "73vh" }}
                    >
                        <Sidenav.Body>
                            <Nav onSelect={(e) => handleSelect(e)}>
                                <Nav.Item eventKey="1" active icon={<DashboardIcon />}>
                                    Gestión de la cuenta
                                </Nav.Item>
                                <hr className='my-0' style={{ border: "solid 1px grey" }} />
                                <Nav.Item eventKey="2" icon={<GroupIcon />}>
                                    Historial de compras
                                </Nav.Item>
                            </Nav>
                        </Sidenav.Body>
                    </Sidenav>
                    <NavToggle expand={expand} onChange={() => setExpand(!expand)} handleLogout={handleLogout} />
                </Sidebar>

                <Panel bordered className='m-4 w-100' style={{ border: "1px solid #4F979C" }}>
                    {openTab === "1" && (
                        <GestionCuenta />
                    )}
                    {openTab === "2" && (
                        <Historial />
                    )}
                </Panel>
            </Container>
        </div>
    )
}
