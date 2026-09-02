import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';

import AgentSelect from './AgentSelect';

const SLOGAN = '你的专属 AI 助手';

const styles = createStaticStyles(({ css }) => ({
  // The measure comes from the layout (`--home-greeting-measure`), which derives
  // it from the container width: it has to clear the portrait's bubble, and it
  // must not depend on the rail, or collapsing would re-wrap the headline and
  // shove the composer and the whole task list down by a line.
  greeting: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    max-width: var(--home-greeting-measure, none);
    margin: 0;

    font-size: 22px;
    line-height: 1.4;
    letter-spacing: -0.01em;
  `,
  toolbar: css`
    width: 100%;
    min-width: 0;
    min-height: 48px;
  `,
}));

interface HomeHeaderProps {
  centered?: boolean;
}

const HomeHeader = memo<HomeHeaderProps>(({ centered }) => {
  return (
    // Minimal mode keeps the full layout's stacking order — the switcher names
    // who speaks, the greeting answers below — but drops the toolbar chrome and
    // its 48px lane, so the pair reads as one compact block flush with the
    // composer. The layout's lift math (MINIMAL_LIFT) counts on these heights.
    <Flexbox gap={centered ? 8 : 16} justify={'center'}>
      {centered ? (
        <AgentSelect />
      ) : (
        <Flexbox horizontal align={'center'} className={styles.toolbar}>
          <AgentSelect />
        </Flexbox>
      )}
      <Text as={'h1'} className={styles.greeting} weight={600}>
        {SLOGAN}
      </Text>
    </Flexbox>
  );
});

export default HomeHeader;
