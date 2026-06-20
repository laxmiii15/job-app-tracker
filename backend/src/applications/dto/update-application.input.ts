import { InputType, PartialType } from '@nestjs/graphql';
import { CreateApplicationInput } from './create-application.input';

/**
 * All fields from CreateApplicationInput, made optional so callers can send
 * partial updates. Validation decorators are inherited.
 */
@InputType()
export class UpdateApplicationInput extends PartialType(CreateApplicationInput) {}
