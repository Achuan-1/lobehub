'use client';

import { BRANDING_NAME } from '@lobechat/business-const';
import { Block, Flexbox, Icon } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { createStaticStyles, cssVar } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';

import { useActiveIdentity } from '@/business/client/hooks/useActiveIdentity';
import { ProductLogo } from '@/components/Branding';
import { USER_DROPDOWN_ICON_ID } from '@/features/NavPanel/constants';
import UserAvatar from '@/features/User/UserAvatar';
import UserPanel from '@/features/User/UserPanel';
import { useUserStore } from '@/store/user';
import { authSelectors, userProfileSelectors } from '@/store/user/selectors';

// The dropdown is a button surface, not selectable text. Without
// `user-select: none` a triple-click (or click-drag through the avatar /
// name) paints the system text-selection highlight across the whole row;
// that bright blue is heavier than the Sidebar's active-route fill below
// and inverts the visual hierarchy.
const styles = createStaticStyles(({ css }) => ({
  trigger: css`
    user-select: none;
  `,
}));

const User = memo<{ lite?: boolean }>(({ lite }) => {
  const [nickname, username, isSignedIn] = useUserStore((s) => [
    userProfileSelectors.nickName(s),
    userProfileSelectors.username(s),
    authSelectors.isLogin(s),
  ]);

  // When in a team workspace, reflect the workspace context in the header
  // (avatar + name) instead of the user's identity. Personal workspaces and
  // this shared no-login deployment use the product branding.
  const activeIdentity = useActiveIdentity();
  const displayAvatar = activeIdentity?.avatar ?? (isSignedIn ? '/achuan-ai-logo.png' : undefined);
  const displayName = activeIdentity?.name ?? (isSignedIn ? BRANDING_NAME : nickname || username);

  return (
    <UserPanel>
      <Block
        clickable
        horizontal
        align={'center'}
        className={styles.trigger}
        gap={8}
        paddingBlock={2}
        variant={'borderless'}
        style={{
          minWidth: 32,
          overflow: 'hidden',
          paddingInlineEnd: lite ? 2 : 8,
          paddingInlineStart: 2,
        }}
      >
        <UserAvatar
          avatarOverride={displayAvatar}
          nameOverride={activeIdentity?.name ?? (isSignedIn ? BRANDING_NAME : undefined)}
          shape={'square'}
          size={28}
        />
        {!lite && (
          <Flexbox horizontal align={'center'} gap={4} style={{ overflow: 'hidden' }}>
            {!isSignedIn && !activeIdentity ? (
              <ProductLogo color={cssVar.colorText} size={28} type={'text'} />
            ) : (
              <Text ellipsis style={{ flex: 1 }} weight={500}>
                {displayName}
              </Text>
            )}
            <Icon
              color={cssVar.colorTextDescription}
              icon={ChevronDownIcon}
              id={USER_DROPDOWN_ICON_ID}
            />
          </Flexbox>
        )}
      </Block>
    </UserPanel>
  );
});

export default User;
