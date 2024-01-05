import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {

    }
    @Get()
    getAll(): Movie[]{
        return this.moviesService.getAll();
    }
    
    @Get("search")
    search(@Query('year') searchingYear: string){ //@Query로 쿼리를 받아올 수 있다.
        return `We are searching for a movie made after: ${searchingYear} `;
    } 

    @Get(":id")
    getOne(@Param('id') movieId:number){ //@Param을 사용해야 url 상 id를 얻어올 수 있다. 날로 먹을 수 없다.
        console.log(typeof movieId);
        return this.moviesService.getOne(movieId);
    }

    @Post()
    create(@Body() movieData: CreateMovieDto){
        return this.moviesService.create(movieData);
    }

    @Delete(":id")
    remove(@Param('id') movieId:number){
        return this.moviesService.deleteOne(movieId);
    }

    @Patch(":id")
    patch(@Param('id') movieId:number, @Body() updateData: UpdateMovieDto){
        return this.moviesService.update(movieId, updateData);
    }

}