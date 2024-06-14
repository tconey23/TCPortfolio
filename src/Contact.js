import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
  const initialState = {
    name: '',
    from: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_sj8p1yb',
      'template_j79vman',
      formData,
      'iEa1QtTEPPBHKUYfL'
    ).then((result) => {
      setFormData(initialState);
    }, (error) => {
      console.log(error.text);
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        required
        type="text"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        />
      <label>Email</label>
      <input
        required
        type="email"
        name="from"
        placeholder="Your email address"
        value={formData.from}
        onChange={handleChange}
        />
      <label>Message</label>
      <textarea
        required
        name="message"
        placeholder="Type your message here"
        value={formData.message}
        onChange={handleChange}
        />
      <button type="submit">SUBMIT</button>
    </form>
        </>
  );
}

export default Contact;
