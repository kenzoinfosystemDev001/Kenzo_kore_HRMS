import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      name: 'Kenzo HRMS Enterprise API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      documentation: '/api/docs',
    };
  }
}
