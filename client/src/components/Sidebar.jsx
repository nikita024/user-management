import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home24Regular,ArrowTrending24Regular,BookCoins24Filled} from "@fluentui/react-icons";
import { fetchProfiles } from "../redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfileDataAndSetId = async () => {
      const profiles = await dispatch(fetchProfiles());
      setProfileId(profiles?.payload[0]?.id);
    };
    
    fetchProfileDataAndSetId();
  }, [currentUser?.id, dispatch]);

  return (
    <div className="sidebar">
      <ul>
        <Link to="/dashboard">
          <li>
          <Home24Regular  style={{marginRight: "5px",verticalAlign: "middle"}}/> Home
          </li>
        </Link>
        <Link to={`/profile/${profileId}`}>
          <li>
          < BookCoins24Filled style={{marginRight: "5px",verticalAlign: "middle"}}/> Profile
          </li>
        </Link>
        {currentUser?.is_admin ? (
          <Link to="/reports">
            <li>
            < ArrowTrending24Regular style={{marginRight: "5px",verticalAlign: "middle"}}/> Report
            </li>
          </Link>
        ) : null}
      </ul>
    </div>
  );
};

export default Sidebar;
