export interface LinkItem {
  label: string;
  url: string;
}

export interface Archive {
  no: string;
  name: string;
  tag: string;
  group: "col-ai" | "col-qa";
  brief: string;
  tech: string[];
  metrics: string[];
  summary: string;
  content: string[];
  links: LinkItem[];
}

export interface GroupDef {
  id: string;
  label: string;
}

export const GROUPS: GroupDef[] = [
  { id: "col-ai", label: "AI 系统 · 智能体" },
  { id: "col-qa", label: "质量守卫 · 工程工具" },
];

export const ARCHIVES: Archive[] = [
  {
    no: "001",
    name: "灵魂工坊",
    tag: "多智能体自主决策引擎",
    group: "col-ai",
    brief: "不依赖大模型API的多智能体行为引擎，适用于智能客服、数字员工、虚拟角色场景。",
    tech: ["Python", "AI编码辅助", "Pipeline", "状态机"],
    metrics: [
      "200+智能体同时在线，决策延迟<50ms",
      "月API成本$0（对比GPT-4方案$200+）",
      "LOD调度降低70%计算开销",
    ],
    summary:
      "「灵魂工坊」解决的核心业务问题：智能客服和数字员工需要角色有记忆、有情绪、有个性化反应，但大模型API成本高、延迟高、输出不可控。我设计了一套6层Pipeline的本地推理引擎，全部在本地完成推理，零API依赖、毫秒级响应、推理链可追溯。",
    content: [
      "「全程使用AI编码辅助开发，Prompt调试NPC人格模板，18天从原型到产品交付。用AI辅助生成对话测试用例，覆盖6种情绪状态的边界场景，再用自研CodeGuard Skill对AI生成代码进行质量扫描。」",
      "「6层Pipeline架构（感知→意图识别→记忆管理→情绪建模→决策推理→行为生成），每层解耦，推理链完整可追溯。情绪系统采用6维空间（快乐/悲伤/愤怒/恐惧/惊讶/厌恶），每个智能体拥有独立的情绪记忆。」",
      "「LOD分级调度是性能关键：核心智能体跑满6层Pipeline，背景智能体仅跑4层，计算开销降低70%以上，200+智能体同时在线流畅运行。记忆系统采用滑动窗口+自动摘要压缩，内存占用严格有上限。」",
      "「关系网络随事件演化，支持涟漪传播——关系变化15%级联到旁观智能体，模拟真实社交动力学。适用于智能客服人设引擎、数字员工、虚拟角色交互等AI落地场景。」",
    ],
    links: [
      { label: "在线体验", url: "https://nothern131.github.io/portfolio/soul-workshop/" },
      { label: "GitHub", url: "https://github.com/Nothern131" },
    ],
  },
  {
    no: "002",
    name: "天机阁",
    tag: "知识推理引擎系统",
    group: "col-ai",
    brief: "垂直领域知识工程化引擎，将规则密集型领域知识结构化为可计算引擎，替代高成本LLM调用。",
    tech: ["Python", "FastAPI", "JavaScript", "规则引擎"],
    metrics: [
      "响应0.02ms（比LLM调用快1000倍）",
      "千并发P99<4.5ms，API成本$0",
      "12个独立算法引擎，O(1)查询",
    ],
    summary:
      "「天机阁」解决的核心业务问题：法律、医疗、金融等规则密集型领域需要确定性推理，但LLM调用成本高、延迟高、输出不可控。我将领域知识结构化为可计算引擎，全部本地计算，零API依赖、毫秒级响应、推理链可审计。",
    content: [
      "「用LLM辅助验证知识抽取准确率，AI生成测试用例覆盖边界场景，Prompt调试领域查询模板优化非结构化文本的自动解析。方法论可直接迁移到法律/医疗/金融领域。」",
      "「12个独立算法引擎通过统一注册中心管理，全模块采用查表法替代条件分支，消除CPU分支预测失败，所有查询均为O(1)时间复杂度。」",
      "「单次API响应延迟0.02~0.35ms，千次并发P99延迟不超过4.5ms——比传统LLM调用快1000倍。无状态API设计，天然支持水平扩展。」",
      "「状态用12-bit整数编码，位运算直接推演，内存占用降低87%。前后端分离部署，纯静态前端+FastAPI后端，支持PWA离线使用。」",
    ],
    links: [
      { label: "在线体验", url: "https://nothern131.github.io/tianjige/" },
      { label: "GitHub", url: "https://github.com/Nothern131" },
    ],
  },
  {
    no: "003",
    name: "岐黄阁",
    tag: "领域知识推理系统",
    group: "col-ai",
    brief: "医疗领域可解释推理系统，确定性输出、推理可审计，规则引擎替代LLM实现零成本推理。",
    tech: ["JavaScript", "规则引擎", "PWA", "纯前端"],
    metrics: [
      "零服务器成本，纯静态部署",
      "推理链完整可审计，确定性输出",
      "30+可视化组件，12种数据源",
    ],
    summary:
      "「岐黄阁」解决的核心业务问题：医疗领域需要确定性结论（不能靠概率），推理过程必须可审计。我用规则引擎替代LLM，实现相同输入永远相同输出的确定性推理，零服务器成本、推理链完整透明。",
    content: [
      "「AI辅助知识结构化，将古籍文本转化为JSON规则表。规则引擎替代LLM实现确定性推理——相同输入永远相同输出，推理链路完整输出，每一步决策可审计。」",
      "「配伍禁忌（十八反十九畏、君臣佐使）用规则引擎实现，全表匹配，零条件分支。药性数据（四气五味、归经、升降浮沉）采用JSON表驱动建模，预制反向索引实现O(1)查询。」",
      "「纯静态PWA部署，零服务器成本。推理过程完整透明：输入→规则匹配→中间结论→最终结论，可解释、可追溯。」",
      "「方法论可迁移到任何规则密集型领域——法律条文推理、金融合规检查、保险条款匹配等场景均可直接复用架构。」",
    ],
    links: [
      { label: "在线体验", url: "https://nothern131.github.io/qihuangge/" },
      { label: "GitHub", url: "https://github.com/Nothern131" },
    ],
  },
  {
    no: "004",
    name: "CodeGuard",
    tag: "AI代码质量保障体系",
    group: "col-qa",
    brief: "AI生成代码的质量保障Skill，可直接被AI编码助手加载使用，8维度80规则自动评分。",
    tech: ["Agent Skill", "AST", "规则引擎", "CI/CD"],
    metrics: [
      "扫描<2s/千行，误报率<5%",
      "AI生成代码缺陷率降至<5%",
      "8维度80规则，量化评分",
    ],
    summary:
      "「CodeGuard」解决的核心业务问题：AI生成代码质量参差不齐，需要自动化质量保障。我设计为AI Agent可直接加载的Skill，在4个项目的真实开发流程中使用，让AI生成代码达到生产级质量标准。",
    content: [
      "「设计为AI Agent可直接加载的Skill，在4个项目的开发流程中实际使用。AI生成代码经扫描后缺陷率降至5%以下，扫描速度<2s/千行代码。」",
      "「8个维度覆盖：错误处理、权限安全、数据库保护、问题诊断、韧性设计、内存安全、并发安全、资源管理。每个维度下设有具体检测规则，共计80条。」",
      "「量化评分体系采用加权扣分制：Critical -40分，High -25分，Medium -15分，Low -5分。初始分100，低于60分为不合格。可快速定位代码质量等级。」",
      "「可作为CLI工具、VS Code插件或CI/CD流水线步骤使用。Apache 2.0开源，社区可用。已在真实项目中验证——本次作品集的代码就是用它扫描通过的。」",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Nothern131/agent-skills" },
      { label: "使用文档", url: "#" },
    ],
  },
];
