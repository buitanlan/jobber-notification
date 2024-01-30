import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_PASSWORD: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || 'S5S2u@example.com';
    this.SENDER_PASSWORD = process.env.SENDER_PASSWORD || 'password';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || 'amqp://localhost';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || 'http://localhost:9200';
  }
}

export const config = new Config();
