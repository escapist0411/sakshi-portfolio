const bugInputs = ["Priority", "Severity", "Component", "Reporter reliability", "Developer workload"];
const bugEstimates = ["Short-lived", "Medium-lived", "Long-lived"];

export default function ProjectDiagram({ kind }: { kind: "bug-lifespan" | "table-reservation" }) {
  if (kind === "bug-lifespan") {
    return (
      <figure className="project-diagram">
        <figcaption className="diagram-heading technical">
          <span>Bug lifespan prediction</span><span aria-hidden="true">Research workflow</span>
          <span className="sr-only">Issue metadata is engineered into features for a model that estimates whether a bug will be short-, medium-, or long-lived.</span>
        </figcaption>
        <div className="diagram-body bug-diagram" aria-hidden="true">
          <div className="diagram-inputs">
            <span className="diagram-label">Issue metadata</span>
            <ul>{bugInputs.map(input => <li key={input}>{input}</li>)}</ul>
          </div>
          <div className="diagram-connector" />
          <div className="diagram-processor"><span>Feature engineering</span><strong>ML model</strong></div>
          <div className="diagram-connector" />
          <div className="diagram-outputs">
            <span className="diagram-label">Estimate</span>
            <ul>{bugEstimates.map(estimate => <li key={estimate}>{estimate}</li>)}</ul>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className="project-diagram">
      <figcaption className="diagram-heading technical">
        <span>Table reservation</span><span aria-hidden="true">Booking workflow</span>
        <span className="sr-only">Choose a restaurant, check table availability for the requested date and time, and confirm the reservation.</span>
      </figcaption>
      <div className="diagram-body reservation-diagram" aria-hidden="true">
        <div className="reservation-plan">
          <span className="diagram-label">Table availability</span>
          <div className="plan-grid">
            {[false, true, false, false, false, false].map((selected, index) => (
              <span className={selected ? "plan-table is-selected" : "plan-table"} key={index} />
            ))}
          </div>
        </div>
        <div className="diagram-connector" />
        <div className="reservation-steps">
          <span>Restaurant</span><span>Date / time</span><strong>Confirmed</strong>
        </div>
      </div>
    </figure>
  );
}
