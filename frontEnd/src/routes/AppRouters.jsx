import {BrowserRouter as Router , Route , Routes} from "react-router-dom";
import UserLogin from "../components/auth/UserLogin";
import UserRegister from "../components/auth/UserRegister";
import FoodPartnerLogin from "../components/auth/FoodPartnerLogin";
import FoodPartnerRegister from "../components/auth/FoodPartnerRegister";
import HomePage from "../pages/HomePage";
import FoodPartnerProfile from "../pages/FoodPartnerProfile";
import CreateFood from "../pages/CreateFood";
import Landing from "../pages/Landing";
import OrderFood from "../pages/OrderFood";
import UserProfile from "../components/profiles/UserProfile";
import PartnerProfile from "../components/profiles/PartnerProfile";
import AllFoodStore from "../pages/AllFoodStore";
import FoodPartnerLocationSetup from "../components/shared/FoodPartnerLocation";
import PaymentSuccess from "../pages/PaymentSuccess";
const AppRouters = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />}/>
                <Route path="/user/login" element={<UserLogin />}/>
                <Route path="/food-partner/register" element={<FoodPartnerRegister />}/>
                <Route path="/food-partner/login" element={<FoodPartnerLogin />}/>
                <Route path="/" element={<Landing/>}/>
                <Route path="/food-partner/:id" element={<FoodPartnerProfile/>}/>
                <Route path="/create-food" element={<CreateFood/>}/>
                <Route path="/explore" element={<HomePage/>}/>
                <Route path= "/order/food/:id" element={<OrderFood/>}/>
                <Route path="/payment/success" element={<PaymentSuccess/>}/>

                <Route path="/food-partner-store" element={<AllFoodStore/>}/>

                <Route path="/user-profile" element={<UserProfile/>}/>
                <Route path="/partner-profile" element={<PartnerProfile/>}/>

                <Route path={"/foodPartner-locationSetup/:id"} element={<FoodPartnerLocationSetup/>}/>
    


            </Routes>
        </Router>
    </div>
  ) 
}

export default AppRouters
