import { Repository } from 'typeorm';
import { PageDto } from './dto/page.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-options.dto';

interface IPaginateParams<T> {
  name: string;
  repository: Repository<T>;
  query: PageOptionsDto;
  orderBy: string;
  observeVisibility?: boolean;
}

export const paginate = async <T>({
  name,
  orderBy,
  query,
  repository,
  observeVisibility = false,
}: IPaginateParams<T>) => {
  const pageOptionsDto = new PageOptionsDto(
    query.page,
    query.limit,
    query.sort,
  );

  const queryBuilder = repository.createQueryBuilder(name);

  queryBuilder
    .orderBy(orderBy, pageOptionsDto.sort)
    .skip(pageOptionsDto.skip)
    .take(pageOptionsDto.limit);

  if (observeVisibility) {
    queryBuilder.where(`${name}.isPublic = :isPublic`, { isPublic: true });
  }

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  return new PageDto(entities, pageMetaDto);
};
