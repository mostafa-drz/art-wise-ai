self.onmessage = (e) => {
  const file = e.data;
  const reader = new FileReader();

  reader.onload = (event) => {
    const base64String = event.target.result.split(',')[1];
    self.postMessage(base64String);
  };

  reader.readAsDataURL(file);
};
