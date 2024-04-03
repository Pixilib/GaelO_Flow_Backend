import { TagPolicies } from '../constants/enums';

export default class TagAnon {
  tagPolicy: TagPolicies;
  tag: string;
  replaceValue: string | number | undefined;

  constructor(
    tag: string,
    tagPolicy: TagPolicies,
    replaceValue: string | number | undefined = undefined,
  ) {
    this.tagPolicy = tagPolicy;
    this.tag = tag;
    this.replaceValue = replaceValue;
  }
}
