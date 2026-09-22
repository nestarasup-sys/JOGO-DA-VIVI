export type CharacterId='gael'|'leon'|'ravi'|'maya'|'player';
export type Expression='neutral'|'smile'|'tease'|'serious'|'blush'|'angry'|'sad'|'surprised';
export type Effects={affinity?:Partial<Record<CharacterId,number>>;traits?:Partial<Record<'empathy'|'courage'|'humor',number>>;flags?:Record<string,string|number|boolean>;coins?:number;messages?:string[];unlockCG?:string;route?:CharacterId;outfit?:string};
export type Choice={text:string;tag?:string;effects?:Effects};
export type SceneNode={type?:'routeVariant'|'routeScene'|'ending';bg?:string;loc?:string;speaker?:string;text?:string;show?:[CharacterId,Expression][];choice?:Choice[];effects?:Effects;unlockCG?:string;end?:boolean;flag?:string;variants?:Record<string,SceneNode>};
export type Episode={id:number;title:string;subtitle:string;desc:string;cover:string;nodes:SceneNode[]};
export type Story={meta:{version:number;title:string;season:string};episodes:Episode[]};
