import "./Features.css";

const features = [
  {
    title: "Create Tasks",
    description: "Quickly create and organize your daily tasks."
  },
  {
    title: "Edit Tasks",
    description: "Update task details whenever your plans change."
  },
  {
    title: "Delete Tasks",
    description: "Remove completed or unwanted tasks easily."
  },
  {
    title: "Track Progress",
    description: "Monitor completed and pending tasks in one place."
  },
  {
    title: "Due Dates",
    description: "Set deadlines so you never miss important work."
  },
  {
    title: "Secure Access",
    description: "Your account is protected with secure authentication."
  }
];

function Features() {
  return (
    <section className="features" id="features">
      <h2>Features</h2>
      <p className="features-subtitle">
        Everything you need to stay productive.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;