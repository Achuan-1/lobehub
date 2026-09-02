import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  card: css`
    width: 100%;
    padding-block: 14px;
    padding-inline: 16px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 16px;

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 82%, transparent);
    backdrop-filter: saturate(140%) blur(10px);
  `,
  number: css`
    display: grid;
    flex: none;
    place-items: center;

    width: 26px;
    height: 26px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 50%;

    color: ${cssVar.colorText};
    font-size: 13px;
    font-weight: 600;
    line-height: 1;

    background: ${cssVar.colorFillSecondary};
  `,
  steps: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    margin: 0;
    padding: 0;

    list-style: none;

    @media (width <= 640px) {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  `,
  title: css`
    color: ${cssVar.colorTextSecondary};
    font-size: 13px;
    font-weight: 600;
  `,
}));

const steps = ['选择 AI 模型', '输入问题', '获取回答'] as const;

const QuickStartGuide = memo(() => (
  <Flexbox className={styles.card} gap={12}>
    <Text className={styles.title}>快速开始</Text>
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li key={step}>
          <Flexbox horizontal align={'center'} gap={10}>
            <span aria-hidden className={styles.number}>
              {index + 1}
            </span>
            <Text>{step}</Text>
          </Flexbox>
        </li>
      ))}
    </ol>
  </Flexbox>
));

QuickStartGuide.displayName = 'QuickStartGuide';

export default QuickStartGuide;
