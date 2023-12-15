export enum TagPolicies {
  KEEP = 'Keep',
  REPLACE = 'Replace',
  REMOVE = 'Remove',
}

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
