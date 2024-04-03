import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import Images from "../assets/perpus.png";
import TableAdmin from "../Components/Table/TableAdmin";
import TableAdminSuccess from "../Components/Table/TableAdminSuccess";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Cookies from "../utils/cookies";

const dashboardAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const stateAdmin = useSelector((state) => state.login);

  const handleLogoutAdmin = (e) => {
    e.preventDefault();
    Cookies.delCookies("CERT");
    // window.location.href = '/admin'
    navigate("/admin");
  };

  return (
    <div className="h-screen">
      <div className="container mx-auto ">
        <div className="flex justify-between">
          <Tabs
            variant="unstyled"
            w="100%"
            display="flex"
            flexDirection="row"
            gap={5}
          >
            <div className="w-1/4 h-screen " style={{ marginLeft: "20px" }}>
              <img src={Images} alt="Logo" className="w-40 mx-auto my-2" />
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Avatar"
                className="rounded-full w-1/2 mx-auto my-5"
              />
              <div className="flex flex-col">
                <h1 className="text-xl py-4 font-bold text-center">
                  {stateAdmin.admin.userid}
                </h1>
              </div>
              <TabList display="flex" w="100%" flexDirection="column">
                <Tab
                  _selected={{ color: "white", bg: "blue.500" }}
                  className="my-2"
                >
                  Cek Buku Kembali
                </Tab>
                <Tab
                  _selected={{ color: "white", bg: "blue.500" }}
                  className="my-2"
                >
                  Cek Buku Berhasil
                </Tab>
              </TabList>
            </div>
            <div className="w-full">
              <div className="flex w-full justify-between align-items-center">
                <div className="flex flex-col  py-2 px-4">
                  <h1 className="text-2xl">Dashboard Admin</h1>
                  <p className="text-sm">
                    Welcome back, {stateAdmin.admin.userid}
                  </p>
                </div>
                <div className="flex flex-col py-4 px-4">
                  <Button
                    isLoading={loading}
                    colorScheme="red"
                    onClick={handleLogoutAdmin}
                  >
                    Logout
                  </Button>
                </div>
              </div>
              <TabPanels>
                <TabPanel>
                  <TableAdmin />
                </TabPanel>
                <TabPanel>
                  <TableAdminSuccess />
                </TabPanel>
              </TabPanels>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default dashboardAdmin;
