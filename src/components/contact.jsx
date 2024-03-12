import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

export default function Contact(){
  const [alert, setAlert] = useState(false);

  useEffect(() => {
  },[alert]);

  function handleSubmit(e){
    e.preventDefault();

    setAlert(true);
  }

  return(
    <div className="container" style={{padding:"40px"}}>
      <h5>We would like to hear from you!</h5>
      <Form style={{margin:"40px 0"}}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>
        </Row>
        <Row>
        <Form.Group as={Col} controlId="formGridComments">
            <Form.Label>Feedback</Form.Label>
            <Form.Control as="textarea" />
          </Form.Group>
        </Row>

        <Button variant="info" type="submit" style={{margin:"40px 0"}} onClick={ handleSubmit }>
          Submit
        </Button>
      </Form>
      {alert &&
        <Alert variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p>We will get back with you shortly!</p>
        </Alert>
      }
    </div>
  )
}