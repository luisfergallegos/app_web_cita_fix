import { useProfile } from "../ProfileContext";
import HomeBusiness from "./business/Home_business";
import HomeUser  from "./user/Home_user"; // o tu home normal

const Home = () => {
  const { profile } = useProfile();
  if (profile === "business") return <HomeBusiness />;
  return <HomeUser />;
};

export default Home;