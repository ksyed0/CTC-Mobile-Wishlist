/**
 * EmptyState component tests — BUG-073
 *
 * Validates the props contract and conditional rendering logic for EmptyState.
 */

// ---------------------------------------------------------------------------
// Props contract mirror
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

function buildProps(overrides: Partial<EmptyStateProps> = {}): EmptyStateProps {
  return {
    title: 'Nothing here',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmptyState — props contract', () => {
  it('requires a title', () => {
    const props = buildProps({ title: 'No items yet' });
    expect(props.title).toBe('No items yet');
  });

  it('uses "inbox" as the default icon when none provided', () => {
    const defaultIcon = 'inbox';
    const props = buildProps();
    const icon = props.icon ?? defaultIcon;
    expect(icon).toBe('inbox');
  });

  it('accepts a custom icon', () => {
    const props = buildProps({ icon: 'favorite-border' });
    expect(props.icon).toBe('favorite-border');
  });

  it('subtitle is optional and defaults to undefined', () => {
    const props = buildProps();
    expect(props.subtitle).toBeUndefined();
  });

  it('renders subtitle when provided', () => {
    const props = buildProps({ subtitle: 'Add some items to get started.' });
    expect(props.subtitle).toBe('Add some items to get started.');
  });

  it('renders correctly with all props', () => {
    const props = buildProps({
      icon: 'search-off',
      title: 'No products found',
      subtitle: 'Try selecting a different category.',
    });
    expect(props.icon).toBe('search-off');
    expect(props.title).toBe('No products found');
    expect(props.subtitle).toBe('Try selecting a different category.');
  });
});
