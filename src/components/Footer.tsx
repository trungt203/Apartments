import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 40px 0;
  margin-top: 40px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const FooterSection = styled.div`
  margin-bottom: 20px;
`;

const FooterTitle = styled.h3`
  color: #fff;
  margin-bottom: 20px;
  font-size: 18px;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: #4CAF50;
  }
`;

const FooterText = styled.p`
  color: #bbb;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 10px;
`;

const StyledLink = styled(Link)`
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4CAF50;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  color: #bbb;
`;

const ContactIcon = styled.span`
  margin-right: 10px;
  color: #4CAF50;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  color: #fff;
  background-color: #444;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4CAF50;
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #444;
  color: #bbb;
  font-size: 14px;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Về chúng tôi</FooterTitle>
          <FooterText>
            ApartmentRent nơi cung cấp thông tin về các căn hộ cho thuê chất lượng, đa dạng và giá cả hợp lý.
          </FooterText>
          <SocialLinks>
            <SocialLink 
                href="https://www.facebook.com/tran.thi.yen.khoa.216431/" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <span role="img" aria-label="facebook">FB</span>
            </SocialLink>
            {/* <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <span role="img" aria-label="twitter">TW</span>
            </SocialLink> */}
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <span role="img" aria-label="instagram">IG</span>
            </SocialLink>
            {/* <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <span role="img" aria-label="youtube">YT</span>
            </SocialLink> */}
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Liên kết</FooterTitle>
          <FooterLinks>
            <FooterLink>
              <StyledLink to="/">Trang chủ</StyledLink>
            </FooterLink>
            <FooterLink>
              <StyledLink to="/about">Giới thiệu</StyledLink>
            </FooterLink>
            <FooterLink>
              {/* <StyledLink to="/services">Dịch vụ</StyledLink> */}
            </FooterLink>
            <FooterLink>
              {/* <StyledLink to="/faq">Câu hỏi thường gặp</StyledLink> */}
            </FooterLink>
            <FooterLink>
              {/* <StyledLink to="/privacy">Chính sách bảo mật</StyledLink> */}
            </FooterLink>
            <FooterLink>
              {/* <StyledLink to="/terms">Điều khoản sử dụng</StyledLink> */}
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Liên hệ</FooterTitle>
          <ContactItem>
            <ContactIcon>📍</ContactIcon>
            <div>Trần Thị Yến Khoa</div>
          </ContactItem>
          <ContactItem>
            <ContactIcon>📞</ContactIcon>
            <div>+84 362 657 101 (Zalo/Call/WhatsApp)</div>
          </ContactItem>
          {/* <ContactItem>
            <ContactIcon>✉️</ContactIcon>
            <div>info@apartmentrent.vn</div>
          </ContactItem> */}
          {/* <ContactItem>
            <ContactIcon>⏰</ContactIcon>
            <div>Thứ Hai - Thứ Sáu: 8:00 - 17:00<br />
            Thứ Bảy: 9:00 - 12:00</div>
          </ContactItem> */}
        </FooterSection>
      </FooterContent>
      
      <FooterContent>
        <Copyright>
          © {currentYear} ApartmentRent. Tất cả các quyền được bảo lưu.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
