// import { Col } from "react-bootstrap";

// export const ProjectCard = ({ title, description, imgUrl }) => {
//   return (
//     <Col size={12} sm={6} md={4}>
//       <div className="proj-imgbx">
//         <img src={imgUrl} />
//         <div className="proj-txtx">
//           <h4>{title}</h4>
//           <span>{description}</span>
//         </div>
//       </div>
//     </Col>
//   )
// }

import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, image_url, project_url }) => {
  const imageSrc = image_url
    ? (image_url.startsWith("http") ? image_url : `http://localhost:5000${image_url}`)
    : "https://via.placeholder.com/400x300?text=No+Image";

    const projectUrl = project_url
    ? project_url.startsWith("http://") ||
      project_url.startsWith("https://")
      ? project_url
      : `https://${project_url}`
    : null;
    
  const card = (
    <div className="proj-card">
      <div className="proj-imgbx">
        <img src={imageSrc} alt={title} />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Col size={12} sm={6} md={4} className="mb-4">
      {project_url ? (
        <a href={project_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
          {card}
        </a>
      ) : (
        card
      )}
    </Col>
  );
};