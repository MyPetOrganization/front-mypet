'use client'

import {
  Container,
  Header,
  Content,
  Footer,
  Navbar,
  Nav,
  InputGroup,
  Input,
  Panel,
  Carousel,
  IconButton
} from 'rsuite';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import SearchIcon from '@rsuite/icons/Search';
import LocationIcon from '@rsuite/icons/Location';
import 'rsuite/dist/rsuite.min.css';
import "./style.css";
import { getCookie } from '@/helpers/Credentials';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping';
import PlusIcon from '@rsuite/icons/Plus';

const CustomInputGroupWidthButton = (placeholder: any, ...props: any[]) => (
  <InputGroup {...props} inside>
    <Input placeholder={placeholder} className='w-100' />
    <InputGroup.Button>
      <SearchIcon />
    </InputGroup.Button>
  </InputGroup>
);

export default function LandingPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_cookie=; Max-Age=-99999999;";
    router.push('/');
  };

  return (
    <>
      <Container>
        <Header className='fs-6'>
          <Navbar appearance="inverse" style={{ background: "#053BA6" }}>
            <Navbar.Brand>MyPet</Navbar.Brand>
            <Nav>
              <Nav.Item icon={<LocationIcon />}>Enviar a Quito</Nav.Item>
            </Nav>
            <Nav style={{ width: "60%" }}>
              <Nav.Item className='w-100'>
                <CustomInputGroupWidthButton size="lg" placeholder="Buscar productos" />
              </Nav.Item>
            </Nav>
            <Nav pullRight>
              <Nav.Item icon={<FontAwesomeIcon icon={faCartShopping} fontSize={30} />}>Carrito</Nav.Item>

              {getCookie('auth_cookie') !== null
                ? <Nav.Menu title="Cuenta"
                  icon={<UserInfoIcon />}
                >
                  <Nav.Item
                    onClick={() => {
                      window.location.href = 'duenos-mascotas/';
                    }}
                  >
                    Configuración
                  </Nav.Item>
                  <Nav.Item
                    onClick={handleLogout}
                  >
                    Salir
                  </Nav.Item>
                </Nav.Menu>
                : <Nav.Item
                  icon={<UserInfoIcon />}
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                >
                  Iniciar Sesión
                </Nav.Item>
              }

            </Nav>
          </Navbar>
        </Header>

        <Content>
          <div className='m-3'>
            {/* <Carousel autoplay className="custom-slider" style={{ maxHeight: 300 }}> */}
            <div className='d-flex justify-content-center'>
              <Carousel 
                className="custom-slider w-75" 
                style={{ maxHeight: 300, marginBottom: 12, borderRadius: 12 }}
                shape='bar'
              >
                <Image src="/1.png" width={600} height={250} alt='' />
                <Image src="/2.jpeg" width={600} height={250} alt='' />
                <Image src="/3.jpg" width={600} height={250} alt='' />
              </Carousel>
            </div>

            <h3 style={{ color: "#0396A6", fontWeight: "bold", marginBottom: 10 }}>Productos destacados</h3>

            <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
              {/* <img src="https://via.placeholder.com/240x180" height="180" /> */}
              <Image src="/1.png" width={240} height={180} alt='' />
              <Panel header="Nombre del producto" style={{ color: "#F28066", fontWeight: "bold" }}>
                <h3 style={{ color: "#04BF68" }}>$0.00</h3>
                <p style={{ color: "black" }}>
                  <small>
                    Descripcion del producto.
                  </small>
                </p>
                <IconButton appearance='primary' color='green' icon={<PlusIcon />} className='mt-2'>
                  Añadir al carrito
                </IconButton>
              </Panel>
            </Panel>
          </div>
        </Content>

        <Footer>Footer</Footer>
      </Container>
    </>
  );
}
