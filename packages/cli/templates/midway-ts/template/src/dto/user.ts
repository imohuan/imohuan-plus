import { Rule, RuleType } from '@midwayjs/validate';

export class UserDTO {
  @Rule(RuleType.number().required())
  id: number;

  @Rule(RuleType.string().required())
  firstName: string;

  @Rule(RuleType.string().max(10))
  lastName: string;

  @Rule(RuleType.number().max(60))
  age: number;
}

/*
  PickDto 选出指定的字段
  export class SimpleUserDTO extends PickDto(UserDTO, [ 'firstName', 'lastName', ]) {}
  OmitDto 删除指定的字段
  export class NewUserDTO extends OmitDto(UserDTO, ['age']) {}

  Rule使用另一个class,rule
  @Rule(SchoolDTO)

  // https://joi.dev/api/  验证模式
  RuleType.number().required();               // 数字，必填
  RuleType.string().empty('')                 // 字符串非必填
  RuleType.number().max(10).min(1);           // 数字，最大值和最小值
  RuleType.number().greater(10).less(50);     // 数字，大于 10，小于 50
  RuleType.string().max(10).min(5);           // 字符串，长度最大 10，最小 5
  RuleType.string().length(20);               // 字符串，长度 20
  RuleType.string().pattern(/^[abc]+$/);      // 字符串，匹配正则格式
  RuleType.object().length(5);                // 对象，key 数量等于 5
  RuleType.array().items(RuleType.string());  // 数组，每个元素是字符串
  RuleType.array().max(10);                   // 数组，最大长度为 10
  RuleType.array().min(10);                   // 数组，最小长度为 10
  RuleType.array().length(10);                // 数组，长度为 10
  RuleType.string().allow('')                 // 非必填字段传入空字符串

  创建自定义验证规则
  const maxString = (length)=> RuleType.string().max(length);
  @Rule(maxString(50))
  @Rule(maxString(50).required())

  指定错误
  @Rule(RuleType.number().required().error(new Error('my custom message')))

  使用
  @Validate()
  async updateUser(@Body() user: UserDTO ) { // user.id }


  // src/config/config.default.ts
  翻译 - 多语言  使用 多语言 Get /user/get_user?locale=zh_CN
  export default {
    // ...
    i18n: {
      // 把你的翻译文本放到这里
      localeTable: {
        zh_CN: {
          // validate: require('../../locales/zh_TW.json'), 完全自定义
          validate: {
            'string.max': 'string is too long',
          },
        },
        en_US: {
          validate: {
            'string.max': '字符超长',
          },
        },
      },
    }
  }

  允许未定义的字段 由于部分用户在参数校验的时候，希望允许出现没有定义的字段，可以在全局配置，以及装饰器上分别设置，前者对全局生效，后者对单个校验生效
  // src/config/config.default.ts 全局配置
  @Validate({
    validationOptions: {
      allowUnknown: true,
    }
  })

*/
