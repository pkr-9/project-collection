import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { apiEndPoint } from "../../../webApi/webapi";

function Account() {
    let userImage;
    const { currentUser } = useSelector((state) => state.user);

    // Check if currentUser and currentUser.photo are defined to avoid errors
    if (currentUser && currentUser.photo) {
        // If the photo is a URL (e.g., stored on disk or a URL from the server)
        if (currentUser.photo.includes('@')) {
            userImage = currentUser.photo.includes('@') ? apiEndPoint.DISK_STORAGE + currentUser.photo.split('@')[1] : currentUser.photo.split('@')[0];
        } else {
            // If the photo is already a base64 string, use it directly
            userImage = currentUser.photo;
        }
    }

    // Fallback to default image if no photo is available
    const fallbackImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png';

    return (
        <>
            <div className="tab-pane fade mb-5 account" id="account-info" role="tabpanel">
                <div className="myaccount-content">
                    <h5 style={{ fontFamily: "Rufina, serif" }}>Account Details</h5>
                    <div className="account-details-form ">
                        <form action="#">
                            <div className="single-input-item row">
                                {/* Conditionally render the profile image */}
                                <img 
                                    src={userImage || fallbackImage} 
                                    alt="Profile Image" 
                                    style={{ height: '150px', width: '180px', borderRadius: "50%", margin: "auto" }} 
                                />
                            </div>

                            <div className="single-input-item">
                                <i className="fas fa-user fa-lg me-3 fa-fw" />
                                <label htmlFor="display-name" className="required" style={{ fontFamily: "Rufina, serif" }}>Name <span className="ml-4 heading">{currentUser?.name}</span></label>
                            </div>
                            <div className="single-input-item">
                                <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                                <label htmlFor="email" className="required" style={{ fontFamily: "Rufina, serif" }}>Email <span className="ml-4 heading">{currentUser?.email}</span></label>
                            </div>
                            <div className="single-input-item">
                                <i className="fa fa-phone fa-lg fa-fw" aria-hidden="true" />
                                <label htmlFor="text" className="required ml-3" style={{ fontFamily: "Rufina, serif" }}>Contact <span className="ml-2 heading">{currentUser?.contact}</span></label>
                            </div>
                            <Link to='/update' className="btn btn-sqr mt-3"><i className="fa fa-edit"></i> Edit profile</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;
