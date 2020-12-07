import { css } from "uebersicht";

const options = {
  top: "100px",
  left: "420px",
  width: "600px",
};

export const command = "docker ps -a";

export const initialState = {
  warning: false,
  containers: [],
};

export const refreshFrequency = 1000;

export const className = {
  top: options.top,
  left: options.left,
  width: options.width,
  userSelect: "none",

  backgroundColor: "rgba(0, 0, 0, 0.8)",
  // border: "1px solid #333",
  padding: "5px",
  boxSizing: "border-box",
  borderRadius: "5px",
};

const containerClassName = css({
  color: "#FFF",
  fontFamily: "PT Mono",
});

const tableClassName = css({
  width: "100%",
  marginTop: "3px",
});

const titleClassName = css({
  textAlign: "center",
  color: "#5DADE2",
  fontWeight: "bold",
  fontSize: "14px",
});

const tableHeadingClassName = css({
  textAlign: "left",
  color: "#5DADE2",
  fontSize: "12px",
});

const tableCellClassName = css({
  paddingTop: "3px",
  paddingBottom: "3px",
  fontSize: "12px",
});

export const updateState = (event, previousState) => {
  if (event.error) {
    return { ...previousState, warning: `We got an error: ${event.error}` };
  }

  const lines = event.output.split("\n");

  // const headings = lines[0].split(/[ ]{2,}/);

  const containers = [];

  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];

    const lineParts = line.split(/[ ]{2,}/);

    let containerId = null;
    let image = null;
    let command = null;
    let containerCreated = null;
    let status = null;
    let ports = null;
    let containerName = null;

    if (lineParts.length === 6) {
      // Has no PORTS

      containerId = lineParts[0];
      image = lineParts[1];
      command = lineParts[2];
      containerCreated = lineParts[3];
      status = lineParts[4];
      containerName = lineParts[5];

      // console.log(created);
    } else if (lineParts.length === 7) {
      containerId = lineParts[0];
      image = lineParts[1];
      command = lineParts[2];
      containerCreated = lineParts[3];
      status = lineParts[4];
      ports = lineParts[5];
      containerName = lineParts[6];
    }

    containers.push({
      containerId: containerId,
      image: image,
      command: command,
      containerCreated: containerCreated,
      status: status,
      ports: ports,
      containerName: containerName,
    });
  }

  return {
    warning: false,
    containers: containers,
  };
};

export const render = ({ warning, containers }) => {
  if (warning) {
    return (
      <div className={containerClassName}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossOrigin="anonymous"
        />
        <div className={titleClassName}>
          <i className="fab fa-docker"></i> Docker daemon stopped
        </div>
      </div>
    );
    // If not playing, don't display anything
    // return <div className={containerClassName}>{warning}</div>;
  }

  if (containers.length === 0) {
    return (
      <div className={containerClassName}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossOrigin="anonymous"
        />
        <div className={titleClassName}>
          <i className="fab fa-docker"></i> No Docker containers running
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
        crossOrigin="anonymous"
      />
      <div className={titleClassName}>
        <i className="fab fa-docker"></i> Docker Processes
      </div>
      <table className={tableClassName}>
        <thead>
          <tr>
            <th className={tableHeadingClassName}>ID</th>
            <th className={tableHeadingClassName}>Image</th>
            <th className={tableHeadingClassName}>Command</th>
            {/* <th className={tableHeadingClassName}>Created</th> */}
            <th className={tableHeadingClassName}>Ports</th>
            <th className={tableHeadingClassName}>Status</th>
            {/* <th className={tableHeadingClassName}>Name</th> */}
          </tr>
        </thead>
        <tbody>
          {containers.map(container => (
            <tr key={container.containerId}>
              <td className={tableCellClassName}>
                {container.containerId.substr(0, 6)}
              </td>
              <td className={tableCellClassName}>{container.image}</td>
              <td className={tableCellClassName}>{container.command}</td>
              {/* <td className={tableCellClassName}>{container.containerCreated}</td> */}
              <td className={tableCellClassName}>
                {container.ports ? container.ports : "-"}
              </td>{" "}
              <td className={tableCellClassName}>{container.status}</td>
              {/* <td className={tableCellClassName}>{container.containerName}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
