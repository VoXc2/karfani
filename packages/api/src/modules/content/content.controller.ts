import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Content')
@Controller()
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get('locations')
  @ApiOperation({ summary: 'المواقع والنقاط' })
  getLocations(@Query() query: any) {
    return this.service.getLocations(query);
  }

  @Get('routes')
  @ApiOperation({ summary: 'المسارات' })
  getRoutes(@Query() query: any) {
    return this.service.getRoutes(query);
  }

  @Get('campsites')
  @ApiOperation({ summary: 'المخيمات' })
  getCampsites(@Query() query: any) {
    return this.service.getCampsites(query);
  }

  @Get('map/data')
  @ApiOperation({ summary: 'بيانات الخريطة' })
  getMapData(@Query() query: any) {
    return this.service.getMapData(query);
  }
}
