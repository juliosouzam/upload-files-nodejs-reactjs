import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListDir = styled.li`
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #444;

  & + li {
    margin-top: 15px;
  }
`;

export const Navbar = styled.nav``;

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 30px;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
`;
