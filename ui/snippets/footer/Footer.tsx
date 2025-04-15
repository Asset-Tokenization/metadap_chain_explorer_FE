/* eslint-disable max-len */
import { Box, Grid, Flex, Text, Link, VStack, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
// import discussionsIcon from 'icons/discussions.svg';
// import editIcon from 'icons/edit.svg';
// import cannyIcon from 'icons/social/canny.svg';
// import discordIcon from 'icons/social/discord.svg';
// import gitIcon from 'icons/social/git.svg';
// import twitterIcon from 'icons/social/tweet.svg';
import homeIcon from 'icons/home.svg';
import facebookIcon from 'icons/social/facebook_filled.svg';
import linkedinIcon from 'icons/social/linkedin_filled.svg';
import youtubeIcon from 'icons/social/youtube.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
// import useIssueUrl from 'lib/hooks/useIssueUrl';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 3;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${config.UI.footer.frontendVersion}`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${config.UI.footer.frontendCommit}`;

const Footer = () => {
  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  // const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: homeIcon,
      iconSize: '20px',
      text: 'Home',
      url: 'https://metadap.io/',
    },
    {
      icon: facebookIcon,
      iconSize: '20px',
      text: 'Facebook',
      url: 'https://www.facebook.com/metadap.io',
    },
    {
      icon: linkedinIcon,
      iconSize: '20px',
      text: 'Linkedin',
      url: 'https://www.linkedin.com/company/metadap/',
    },
    {
      icon: youtubeIcon,
      iconSize: '20px',
      text: 'Youtube',
      url: 'https://www.youtube.com/@MetaDigitalAssetPlatform',
    },
  ];

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return (
        <Link href={FRONT_VERSION_URL} target="_blank">
          {config.UI.footer.frontendVersion}
        </Link>
      );
    }

    if (config.UI.footer.frontendCommit) {
      return (
        <Link href={FRONT_COMMIT_URL} target="_blank">
          {config.UI.footer.frontendCommit}
        </Link>
      );
    }

    return null;
  })();

  const fetch = useFetch();

  const { isLoading, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>(
    [''],
    async () => fetch(config.UI.footer.links || ''),
    {
      enabled: Boolean(config.UI.footer.links),
      staleTime: Infinity,
    },
  );

  return (
    <Flex direction="column" borderTop="1px solid" borderColor="divider" as="footer" columnGap="100px">
      <Box px={{ base: 4, lg: 9 }} pt={{ base: 4, lg: 6 }}>
        <Text fontSize="xs">
          DAP Creadit (DAP) được sử dụng như một credit service, nhà phát triển cần đăng ký (subscription) các gói DAP Credit để được cấp quyền ghi dữ liệu vào
          blockchain, DAP Credit sẽ được khấu trừ dần trong quá trình sử dụng. DAP hoàn toàn chỉ được sử dụng với mục đích quản trị, DAP không phải là phương
          tiện thanh toán, MetaDAP Enterprise Blockchain chỉ sử dụng duy nhất một phương tiện thanh toán là tiền pháp định (Fiat). DAP có thể được tặng để
          khuyến khích và tạo điều kiện thuận lợi cho cộng đồng tiếp cận và dùng thử MetaDAP Enterprise Blockchain, DAP hoàn toàn không được sử dụng với mục
          đích gọi vốn.
        </Text>
        <Text mt={6} fontSize="xs">
          DAP Credit (DAP) is used as a credit service, where developers must subscribe to DAP Credit packages to gain permission to write data to the
          blockchain. The DAP Credit balance will gradually be deducted during usage. DAP is strictly for governance purposes and is not a means of payment. The
          MetaDAP Enterprise Blockchain exclusively uses fiat currency as the sole payment method. DAP can be granted as an incentive to encourage and
          facilitate community access and trial usage of the MetaDAP Enterprise Blockchain. However, DAP is strictly prohibited from being used for fundraising
          purposes.
        </Text>
      </Box>
      <Flex direction={{ base: 'column', lg: 'row' }} px={{ base: 4, lg: 9 }} py={{ base: 4, lg: 9 }} columnGap="100px">
        <Box flexGrow="1" mb={{ base: 8, lg: 0 }}>
          <Flex flexWrap="wrap" columnGap={8} rowGap={6}>
            <ColorModeToggler />
            {!config.UI.indexingAlert.isHidden && <IntTxsIndexingStatus />}
            <NetworkAddToWallet />
          </Flex>
          <Box mt={{ base: 5, lg: '44px' }}>
            <Link fontSize="xs" href="https://metadap.io/">
              MetaDAP
            </Link>
          </Box>
          <Text mt={3} maxW={{ base: 'unset', lg: '470px' }} fontSize="xs">
            MetaDAP explorer is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
          </Text>
          <VStack spacing={1} mt={6} alignItems="start">
            {apiVersionUrl && (
              <Text fontSize="xs">
                Backend:{' '}
                <Link href={apiVersionUrl} target="_blank">
                  {backendVersionData?.backend_version}
                </Link>
              </Text>
            )}
            {frontendLink && <Text fontSize="xs">Frontend: {frontendLink}</Text>}
          </VStack>
        </Box>
        <Grid
          gap={{ base: 6, lg: 12 }}
          gridTemplateColumns={
            config.UI.footer.links
              ? {
                  base: 'repeat(auto-fill, 160px)',
                  lg: `repeat(${(linksData?.length || MAX_LINKS_COLUMNS) + 1}, 160px)`,
                }
              : 'auto'
          }
        >
          <Box minW="160px" w={config.UI.footer.links ? '160px' : '100%'}>
            {config.UI.footer.links && (
              <Text fontWeight={500} mb={3}>
                MetaDAP
              </Text>
            )}
            <Grid
              gap={1}
              gridTemplateColumns={config.UI.footer.links ? '160px' : { base: 'repeat(auto-fill, 160px)', lg: 'repeat(4, 160px)' }}
              gridTemplateRows={{
                base: 'auto',
                lg: config.UI.footer.links ? 'auto' : 'repeat(2, auto)',
              }}
              gridAutoFlow={{
                base: 'row',
                lg: config.UI.footer.links ? 'row' : 'column',
              }}
              mt={{ base: 0, lg: config.UI.footer.links ? 0 : '100px' }}
            >
              {BLOCKSCOUT_LINKS.map((link) => (
                <FooterLinkItem {...link} key={link.text} />
              ))}
            </Grid>
          </Box>
          {config.UI.footer.links &&
            isLoading &&
            Array.from(Array(3)).map((i, index) => (
              <Box minW="160px" key={index}>
                <Skeleton w="120px" h="20px" mb={6} />
                <VStack spacing={5} alignItems="start" mb={2}>
                  {Array.from(Array(5)).map((i, index) => (
                    <Skeleton w="160px" h="14px" key={index} />
                  ))}
                </VStack>
              </Box>
            ))}
          {config.UI.footer.links &&
            linksData &&
            linksData.slice(0, MAX_LINKS_COLUMNS).map((linkGroup) => (
              <Box minW="160px" key={linkGroup.title}>
                <Text fontWeight={500} mb={3}>
                  {linkGroup.title}
                </Text>
                <VStack spacing={1} alignItems="start">
                  {linkGroup.links.map((link) => (
                    <FooterLinkItem {...link} key={link.text} />
                  ))}
                </VStack>
              </Box>
            ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Footer;
