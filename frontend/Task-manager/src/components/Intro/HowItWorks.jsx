import "./HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Register in just a few seconds to get started."
    },
    {
      number: "02",
      title: "Login",
      description: "Access your personal dashboard securely."
    },
    {
      number: "03",
      title: "Manage Tasks",
      description: "Create, edit, delete, and organize your daily tasks."
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor completed and pending tasks to stay productive."
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <h2>How It Works</h2>
      <p className="how-subtitle">
        Get started in four simple steps.
      </p>

      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card" key={step.number}>
            <div className="step-number">{step.number}</div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;