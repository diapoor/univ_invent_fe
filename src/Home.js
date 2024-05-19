import React from 'react';
import { Container, Row, Col, Table, Button, Navbar, Nav } from 'react-bootstrap';

function Home() {
    return (
        <div>
            {/* Header */}
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Quản lý vật tư</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Trang chủ</Nav.Link>
                        <Nav.Link href="#inventory">Quản lý vật tư</Nav.Link>
                        <Nav.Link href="#lost-damaged">Quản lý hỏng-mất</Nav.Link>
                        <Nav.Link href="#borrowed">Quản lý vật tư cho mượn</Nav.Link>
                        <Nav.Link href="#repair">Quản lý sửa chữa</Nav.Link>
                        <Nav.Link href="#warehouse">Quản lý kho</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Banner */}
            <Container className="text-center my-4">
                <h2>Quản lý vật tư</h2>
                <p>Ứng dụng giúp bạn quản lý vật tư một cách dễ dàng và hiệu quả.</p>
            </Container>

            {/* Các tính năng chính */}
            <Container className="my-4">
                <Row>
                    <Col md={3}>
                        <h3>Quản lý Kho</h3>
                        <p>Thêm, sửa, xóa và tìm kiếm  kho của bạn.</p>
                    </Col>
                    <Col md={3}>
                        <h3>Quản lý hỏng-mất</h3>
                        <p>Theo dõi và quản lý tình trạng hỏng hóc và mất mát của vật tư.</p>
                    </Col>
                    <Col md={3}>
                        <h3>Quản lý vật tư cho mượn</h3>
                        <p>Quản lý việc cho mượn và trả lại vật tư.</p>
                    </Col>
                    <Col md={3}>
                        <h3>Quản lý sửa chữa</h3>
                        <p>Theo dõi và quản lý các vật tư đang được sửa chữa.</p>
                    </Col>
                </Row>
            </Container>

            {/* Bảng danh sách vật tư */}
            <Container className="my-4">
                <h3>Danh sách vật tư</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên vật tư</th>
                            <th>Số lượng</th>
                            <th>Nhà cung cấp</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Vật tư A</td>
                            <td>100</td>
                            <td>Nhà cung cấp X</td>
                            <td>
                                <Button variant="warning" size="sm">Sửa</Button>{' '}
                                <Button variant="danger" size="sm">Xóa</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Vật tư B</td>
                            <td>200</td>
                            <td>Nhà cung cấp Y</td>
                            <td>
                                <Button variant="warning" size="sm">Sửa</Button>{' '}
                                <Button variant="danger" size="sm">Xóa</Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>

            {/* Footer */}
            <footer className="bg-light text-center py-3">
                <Container>
                    <p>&copy; 2024 Quản lý vật tư. Tất cả các quyền được bảo lưu.</p>
                </Container>
            </footer>
        </div>
    );
}

export default Home;
