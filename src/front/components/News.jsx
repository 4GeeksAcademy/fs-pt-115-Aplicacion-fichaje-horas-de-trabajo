import { Link } from "react-router-dom";

// Add the image URL or import the image as needed
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const News = () => {
  return (
    <div className="card shadow-lg rounded-3">
  <div className="card-header bg-primary text-white">
    Header
  </div>
  <div className="card-body">
    <h5 className="card-title">News Title</h5>
    <p className="card-text">
        Some quick example text to build on the card title and make up the bulk of the card's content.
    </p>
    <a href="#" className="btn btn-primary">link to new</a>
  </div>
</div>

    )
  }