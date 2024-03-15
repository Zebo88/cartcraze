import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Contact(){
  const [alert, setAlert] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  },[alert]);

  function handleSubmit(e){
    e.preventDefault();
    setFormCompleted(true);
    setAlert(true);
  }

  return(
    <Container>
      { !formCompleted && 
        <div className="container" style={{padding:"40px"}}>
          <h5>We would like to hear from you!</h5>
          <Form style={{margin:"40px 0"}}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name='email' type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Name</Form.Label>
                <Form.Control name='Name' type="text" placeholder="Name" />
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
          
        </div>
      }

      {alert &&
        <Container style={{padding:"5% 10%"}}>
          <Alert variant="success">
            <Alert.Heading>Successfully submitted!</Alert.Heading>
            <hr />
            <p>Thank you for contacting us. We will get back with you soon!</p>
            <Button variant="success" style={{ width:"100px"}} onClick={ ()=> { navigate('/') } }>Close</Button>
          </Alert>
        </Container>
        
      }
    </Container>
    
    
  )
}