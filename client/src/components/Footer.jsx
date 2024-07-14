import Logo from "../assets/react.svg";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        &copy; {new Date().getFullYear()} <b>Nikks</b>.
      </span>
    </footer>
  );
};

export default Footer;