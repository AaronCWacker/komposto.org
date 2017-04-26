export const fetchSketch = (id, success) => (
  fetch(`/api/sketches/${id}`).then(
    response => response.json()
  ).then(
    success
  )
);

export const fetchHelpDocument = (success) => (
  fetch(`/about/help?only-content=true`).then(
    response => response.text()
  ).then(
    success
  )
);

export const updateSketch = (id, payload, success, fail) => (
  fetch(`/api/sketches/${id}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'same-origin'
  }).then(
    response => {
      response.status === 202
        ? success()
        : fail()
    }
  )
);

export const forkSketch = (id, payload, success, fail) => (
  fetch(`/api/sketches/${id}/fork`, {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'same-origin'
  }).then(
    response => response.json()
  ).then(
    response => success(response)
  )
);
