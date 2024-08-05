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
import StockProductos from '../products/page';
import ChatPage from '../chat/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldDog } from '@fortawesome/free-solid-svg-icons'

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  backgroundColor: "#053BA6",
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const NavToggle = ({ expand, onChange, handleLogout }: { expand: boolean, onChange: () => void, handleLogout: () => void }) => {

  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Nav.Menu
          noCaret
          placement="topStart"
          trigger="click"
          title={<CogIcon style={{ width: 20, height: 20, color: "#04BF68" }} />}
        >
          <Nav.Item>
            <Button onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav.Item>
        </Nav.Menu>
      </Nav>

      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center', color: "#04BF68" }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default function HomePage() {
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
    <div className="sidebar-page" style={{ height: '100vh', display: 'flex' }}>
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: "3px solid #053BA6",
          position: 'fixed',
          top: 0,
          bottom: 0,
          height: '100vh',
          width: expand ? 240 : 70,
          zIndex: 1000,
          transition: 'width 0.3s',
          // background: "#053BA6"
        }}
        collapsible
      >
        <Sidenav.Header>
          <div style={headerStyles} className='align-middle'>
            <FontAwesomeIcon icon={faShieldDog} fontSize={30} />
            {expand ? <span style={{ marginLeft: 12 }} className='fw-bolder fs-5'>My Pet</span> : ""}
          </div>
        </Sidenav.Header>
        <Sidenav
          expanded={expand}
          defaultOpenKeys={['3']}
          appearance="subtle"
          style={{ flex: 1, overflowY: 'auto' }}
        >
          <Sidenav.Body>
            <Nav onSelect={(e) => handleSelect(e)}>
              <Nav.Item eventKey="1" active icon={<DashboardIcon />} style={{ color: "#04BF68", fontWeight: "bold" }}>
                Stock de productos
              </Nav.Item>
              <hr className='my-0 mx-1' style={{ border: "solid 2px #FE5028" }} />
              <Nav.Item eventKey="2" icon={<GroupIcon />} style={{ color: "#04BF68", fontWeight: "bold" }}>
                Chat de emprendedores
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} handleLogout={handleLogout} />
      </Sidebar>

      <div style={{ marginLeft: expand ? 240 : 70, flex: 1, overflowY: 'auto' }}>
        <Panel bordered className='m-4' style={{ border: "3px solid #053BA6" }}>
          {openTab === "1" && (
            <StockProductos />
            // <span>Holaaaa</span>
          )}
          {openTab === "2" && (
            <ChatPage />
          )}
        </Panel>
      </div>
    </div>
  );
}
