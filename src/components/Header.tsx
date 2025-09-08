import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #3d8b40;
  }
`;

const LogoIcon = styled.span`
  margin-right: 10px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #4CAF50;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #333;
    
    &:after {
      width: 100%;
    }
  }
  
  &.active {
    color: #4CAF50;
    
    &:after {
      width: 100%;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          <LogoIcon>🏢</LogoIcon>
          <span>ApartmentRent</span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/">Trang chủ</NavLink>
          {/* <NavLink to="/about">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink> */}
          {/* <NavLink to="/admin/apartments">Quản lý</NavLink> */}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Header;
